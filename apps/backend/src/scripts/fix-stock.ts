import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { linkSalesChannelsToStockLocationWorkflow } from "@medusajs/medusa/core-flows"

export default async function fixStockLocation({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelId = "sc_choco_dxn23"

  logger.info("Fetching stock locations...")
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  if (!stockLocations || stockLocations.length === 0) {
    logger.warn("No stock locations found.")
    return
  }

  const stockLocation = stockLocations[0]
  logger.info(`Linking stock location ${stockLocation.name} (${stockLocation.id}) to sales channel ${salesChannelId}...`)

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [salesChannelId],
    },
  })

  logger.info("Successfully linked sales channel to stock location.")
}
