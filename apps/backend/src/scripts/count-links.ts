import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function countLinks({ container }: any) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: channels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })

  for (const channel of channels) {
    const { data: links } = await query.graph({
      entity: "product_sales_channel",
      fields: ["product_id"],
      filters: { sales_channel_id: channel.id }
    })
    console.log(`Channel ${channel.name} (${channel.id}): ${links.length} products`)
  }
}
