import { defineMiddlewares } from "@medusajs/medusa"
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/medusa"

export async function tenantMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  // Extract tenant ID from header (or JWT token)
  const tenantId = req.headers["x-tenant-id"] as string

  if (tenantId) {
    // In Medusa v2 we have access to the query layer.
    // For raw RLS isolation in MikroORM we ensure that this parameter 
    // is set for the Postgres transaction session in the event context
    // Alternatively, just bind it to the request scope for API usage:
    req.scope.register({
      tenantId: {
        resolve: () => tenantId,
      },
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
