import { defineMiddlewares } from "@medusajs/framework/http"
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http"
import { tenantContextStorage } from "./tenant-context"

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

  if (tenantId) {
    // 3. Run the entire request context within the ACL
    return tenantContextStorage.run(tenantId, async () => {
      // 4. Register in scope for logic usage
      req.scope.register({
        tenantId: {
          resolve: () => tenantId,
        },
      })

      // 5. Set Postgres Session Variable for RLS
      try {
        const dbConnection = req.scope.resolve("db_connection") as any
        await dbConnection.query(`SET app.current_tenant_id = '${tenantId}'`)
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
    }
  ],
})
