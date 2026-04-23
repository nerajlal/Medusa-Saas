import { Modules } from "@medusajs/framework/utils"

export default async function findSalesChannels({ container }: any) {
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const pgConnection = container.resolve("__pg_connection__")
  
  const tenants = ['nike-shop', 'apple-premium', 'adidas-boost', 'choco-bliss', 'raleys-market']
  
  for (const tenantId of tenants) {
    await pgConnection.raw(`SET app.current_tenant_id = '${tenantId}'`)
    const channels = await salesChannelModuleService.listSalesChannels({})
    console.log(`Tenant: ${tenantId}`)
    channels.forEach((c: any) => console.log(`  - ${c.name}: ${c.id}`))
  }
}
