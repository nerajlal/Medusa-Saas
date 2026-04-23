import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkLinks({ container }: any) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: links } = await query.graph({
    entity: "product_sales_channel",
    fields: ["product_id", "sales_channel_id"],
  })

  console.log(`Total Product-SalesChannel Links: ${links.length}`)
  
  const sampleLinks = links.slice(0, 10)
  console.log("Sample Links:", sampleLinks)
}
