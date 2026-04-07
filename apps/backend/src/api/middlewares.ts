import { defineMiddlewares } from "@medusajs/medusa"
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/medusa"
import { tenantContextStorage } from "./tenant-context"

export async function tenantMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  // Extract tenant ID from header (or JWT token)
  const tenantId = req.headers["x-tenant-id"] as string

  if (tenantId) {
    // 1. Run the entire request context within the ACL
    return tenantContextStorage.run(tenantId, async () => {
      // 2. Register in scope for logic usage
      req.scope.register({
        tenantId: {
          resolve: () => tenantId,
        },
      })

      // 3. Set Postgres Session Variable for RLS
      try {
        const dbConnection = req.scope.resolve("db_connection")
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
