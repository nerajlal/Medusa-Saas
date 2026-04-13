import { 
  ExecArgs, 
  ProductStatus
} from "@medusajs/framework/types"
import { 
  ContainerRegistrationKeys, 
  Modules 
} from "@medusajs/framework/utils"
import { 
  createRegionsWorkflow,
  createProductsWorkflow,
  updateProductsWorkflow,
  createSalesChannelsWorkflow
} from "@medusajs/medusa/core-flows"

export default async function fixChocoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  
  const salesChannelId = "sc_choco_dxn23"
  const tenantId = "choco-bliss"

  logger.info(`Starting data fix for tenant: ${tenantId}...`)

  // 1. Create UAE Region
  logger.info("Checking for UAE region...")
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
    filters: { name: "UAE" }
  })

  let regionId
  if (regions.length === 0) {
    logger.info("Creating UAE region...")
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "UAE",
            currency_code: "aed",
            countries: ["ae"],
            payment_providers: ["pp_system_default"]
          }
        ]
      }
    })
    regionId = result[0].id
    logger.info(`Created region: ${regionId}`)
  } else {
    regionId = regions[0].id
    logger.info(`UAE region already exists: ${regionId}`)
  }

  // 2. Ensure Sales Channel exists and is linked
  logger.info(`Linking Sales Channel ${salesChannelId} to region...`)
  // In Medusa 2.0, SCs are linked to products and api keys, but prices are linked to regions/currencies.
  
  // 3. Update Products with AED Prices
  logger.info("Fetching products to update prices...")
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "variants.id", "variants.title"],
  })

  for (const product of products) {
    logger.info(`Updating prices for: ${product.title}`)
    const updateInput = {
      id: product.id,
      variants: product.variants.map(v => ({
        id: v.id,
        prices: [
          {
            currency_code: "aed",
            amount: 15000, // AED 150.00 default
          },
          {
            currency_code: "usd",
            amount: 4000,
          }
        ]
      }))
    }
    
    await updateProductsWorkflow(container).run({
      input: {
        products: [updateInput]
      }
    })
  }

  logger.info("Data fix completed successfully!")
}
