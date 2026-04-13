import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createShippingOptionsWorkflow } from "@medusajs/medusa/core-flows"

export default async function seedUaeShipping({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)

  logger.info("Initializing UAE shipping setup...")

  // Grab the UAE region
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
    filters: { name: "UAE" }
  })
  
  if (!regions.length) {
    logger.warn("UAE region not found. Run fix-choco-data.ts first.")
    return
  }
  const region = regions[0]

  // Get shipping profile
  const { data: profiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "type"],
  })
  const defaultProfile = profiles.find(p => p.type === "default") || profiles[0]

  // Get fulfillment set and service zones
  const { data: sets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name", "service_zones.id", "service_zones.name"]
  })
  
  let serviceZoneId = null;
  if (sets.length > 0) {
    serviceZoneId = sets[0].service_zones[0]?.id
  }

  if (!serviceZoneId) {
    logger.warn("No service zone found.")
    return
  }

  logger.info("Creating Standard Delivery shipping option for UAE...")
  
  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Local Delivery",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: serviceZoneId,
        shipping_profile_id: defaultProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            region_id: region.id,
            amount: 5000, // 50 AED
          },
          {
            currency_code: "aed",
            amount: 5000,
          }
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      }
    ]
  })

  logger.info("Successfully created UAE shipping option.")
}
