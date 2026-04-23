import { 
  createRemoteLinkStep,
} from "@medusajs/framework/workflows-sdk"
import { 
  Modules,
} from "@medusajs/framework/utils"
import { 
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils"

export default async function syncAllData({ container }: any) {
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)

  console.log("Fetching all products and sales channels...")
  
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "variants.id"],
  })

  const salesChannels = await salesChannelModuleService.listSalesChannels({})

  console.log(`Found ${products.length} products and ${salesChannels.length} sales channels.`)

  const links: any[] = []

  for (const product of products) {
    for (const salesChannel of salesChannels) {
      // Link product to sales channel
      links.push({
        [Modules.PRODUCT]: { product_id: product.id },
        [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
      })
    }
  }

  if (links.length > 0) {
    console.log(`Creating ${links.length} product-to-sales-channel links...`)
    await remoteLink.create(links)
    console.log("Successfully linked all products to all sales channels.")
  } else {
    console.log("No links to create.")
  }
}
