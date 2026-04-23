import { Modules } from "@medusajs/framework/utils"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function linkChannelsToLocations({ container }: any) {
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION)

  console.log("Fetching sales channels and stock locations...")
  const channels = await salesChannelModuleService.listSalesChannels({})
  const locations = await stockLocationModuleService.listStockLocations({})

  console.log(`Found ${channels.length} channels and ${locations.length} locations.`)

  const links: any[] = []
  for (const channel of channels) {
    for (const location of locations) {
      links.push({
        [Modules.SALES_CHANNEL]: { sales_channel_id: channel.id },
        [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
      })
    }
  }

  if (links.length > 0) {
    console.log(`Linking ${links.length} channel-location pairs...`)
    await remoteLink.create(links)
    console.log("Successfully linked all channels to all locations.")
  } else {
    console.log("No links to create.")
  }
}
