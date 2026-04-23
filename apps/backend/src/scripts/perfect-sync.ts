import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function perfectSync({ container }: any) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION)
  const pgConnection = container.resolve("__pg_connection__")

  console.log("Starting Perfect Sync...")

  // 1. Get ALL Sales Channels and ALL Stock Locations
  const channels = await salesChannelModuleService.listSalesChannels({})
  const locations = await stockLocationModuleService.listStockLocations({})

  console.log(`Found ${channels.length} channels and ${locations.length} locations.`)

  // 2. Link ALL Channels to ALL Locations
  const locationLinks: any[] = []
  for (const channel of channels) {
    for (const location of locations) {
      locationLinks.push({
        [Modules.SALES_CHANNEL]: { sales_channel_id: channel.id },
        [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
      })
    }
  }
  if (locationLinks.length > 0) {
    console.log(`Creating ${locationLinks.length} channel-location links...`)
    await remoteLink.create(locationLinks)
  }

  // 3. For each tenant, link THEIR products to ALL visible channels
  const tenants = ['nike-shop', 'apple-premium', 'adidas-boost', 'choco-bliss', 'raleys-market']
  
  for (const tenantId of tenants) {
    console.log(`\nSyncing for tenant: ${tenantId}`)
    await pgConnection.raw(`SET app.current_tenant_id = '${tenantId}'`)
    await pgConnection.raw(`SET app.bypass_rls = 'false'`)

    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id"],
    })
    console.log(`  Found ${products.length} products for this tenant.`)

    const productLinks: any[] = []
    for (const product of products) {
      for (const channel of channels) {
        productLinks.push({
          [Modules.PRODUCT]: { product_id: product.id },
          [Modules.SALES_CHANNEL]: { sales_channel_id: channel.id },
        })
      }
    }

    if (productLinks.length > 0) {
       console.log(`  Linking ${productLinks.length} product-channel pairs...`)
       await remoteLink.create(productLinks)
    }
  }

  console.log("\nPerfect Sync completed!")
}
