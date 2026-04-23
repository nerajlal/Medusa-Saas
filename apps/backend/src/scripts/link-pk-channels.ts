import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function linkPkToChannels({ container }: any) {
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const apiKeyModuleService = container.resolve("api_key_module_service") // This might be the name in v2

  console.log("Fetching all sales channels and publishable keys...")
  const channels = await salesChannelModuleService.listSalesChannels({})
  
  // In v2, publishable keys are API Keys
  const keys = await apiKeyModuleService.list({
    type: "publishable"
  })

  console.log(`Found ${channels.length} channels and ${keys.length} publishable keys.`)

  const links: any[] = []
  for (const key of keys) {
    for (const channel of channels) {
      links.push({
        api_key: { api_key_id: key.id },
        sales_channel: { sales_channel_id: channel.id },
      })
    }
  }

  if (links.length > 0) {
    console.log(`Linking ${links.length} PK-Channel pairs...`)
    await remoteLink.create(links)
    console.log("Successfully linked all keys to all channels.")
  }
}
