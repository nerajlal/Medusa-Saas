import { defineMiddlewares } from "@medusajs/framework/http"
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http"
import { tenantContextStorage } from "./tenant-context"

import fs from "fs"
import path from "path"

export async function tenantMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  // 1. Try to get tenant from user metadata (for isolated Store Owners)
  // In Medusa v2, authenticated users have their metadata in auth_context
  const authContext = (req as any).auth_context
  let tenantId = authContext?.app_metadata?.tenant_id as string || authContext?.user_metadata?.tenant_id as string

  // 2. Fallback to header (for Storefronts or SuperAdmins)
  if (!tenantId) {
    tenantId = req.headers["x-tenant-id"] as string
  }

  // 3. Fallback to Hostname Lookup (for Custom Domains)
  if (!tenantId) {
    const host = req.headers.host?.split(":")[0] // remove port if present
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      try {
        const dbConnection = req.scope.resolve("__pg_connection__") as any
        const { rows } = await dbConnection.query(
          "SELECT tenant_id FROM store_settings WHERE custom_domain = $1 OR storefront_url = $1 LIMIT 1",
          [host]
        )
        if (rows.length > 0) {
          tenantId = rows[0].tenant_id
        }
      } catch (e) {
        console.error("Hostname tenant lookup failed:", e)
      }
    }
  }

  if (tenantId) {
    // 4. Run the entire request context within the ACL
    return tenantContextStorage.run(tenantId, async () => {
      // 5. Register in scope for logic usage
      req.scope.register({
        tenantId: {
          resolve: () => tenantId,
        },
      })

      // 6. Set Postgres Session Variable for RLS
      try {
        const dbConnection = req.scope.resolve("__pg_connection__") as any
        console.log("DB_CONNECTION_KEYS:", Object.keys(dbConnection))
        if (dbConnection.query) await dbConnection.query(`SET app.current_tenant_id = '${tenantId}'`)
        else if (dbConnection.raw) await dbConnection.raw(`SET app.current_tenant_id = '${tenantId}'`)
        else console.error("No query or raw method found on dbConnection")
      } catch (error) {
        console.error("Failed to set tenant context in DB:", error)
        return res.status(500).json({ error: "Internal server error (Tenant Context)" })
      }
      
      next()
    })
  }

  next()
}



export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/*", // apply to storefront routes
      middlewares: [tenantMiddleware],
    },
    {
      matcher: "/admin/*", // apply to admin routes (with different permission checks)
      middlewares: [tenantMiddleware],
    },
    {
      matcher: "/auth/*", // apply to auth routes for tenant-aware login
      middlewares: [tenantMiddleware],
    }
  ],
})
