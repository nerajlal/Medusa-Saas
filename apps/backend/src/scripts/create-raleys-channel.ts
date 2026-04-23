import { Modules } from "@medusajs/framework/utils"

export default async function createRaleysChannel({ container }: any) {
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const pgConnection = container.resolve("__pg_connection__")
  
  const tenantId = "raleys-market"
  await pgConnection.raw(`SET app.current_tenant_id = '${tenantId}'`)
  
  const channel = await salesChannelModuleService.createSalesChannels([
    { name: "Raley's Marketplace", description: "Main channel for Raley's" }
  ])
  
  console.log(`Created Raley's Channel: ${channel[0].name} - ${channel[0].id}`)
}
