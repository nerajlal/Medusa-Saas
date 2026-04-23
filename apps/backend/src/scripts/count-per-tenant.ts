import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function countPerTenant({ container }: any) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const pgConnection = container.resolve("__pg_connection__")
  
  const tenants = ['nike-shop', 'apple-premium', 'adidas-boost', 'choco-bliss', 'raleys-market']
  
  for (const tenantId of tenants) {
    await pgConnection.raw(`SET app.current_tenant_id = '${tenantId}'`)
    await pgConnection.raw(`SET app.bypass_rls = 'false'`)
    
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id"],
    })
    
    console.log(`Tenant: ${tenantId} - Product Count: ${products.length}`)
  }
}
