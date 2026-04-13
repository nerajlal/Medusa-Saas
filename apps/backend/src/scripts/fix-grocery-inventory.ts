import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function fixGroceryInventory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Fetching products to update manage_inventory...")
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "variants.*"],
  })

  // We will just turn off manage_inventory for all products to ensure they can be added to the box
  const updateInputs = products.map(product => ({
    id: product.id,
    variants: product.variants.map((v: any) => ({
      id: v.id,
      manage_inventory: false,
    }))
  }))

  const batchSize = 10;
  for (let i = 0; i < updateInputs.length; i += batchSize) {
    const batch = updateInputs.slice(i, i + batchSize)
    logger.info(`Updating batch of ${batch.length} products to manage_inventory=false`)
    await updateProductsWorkflow(container).run({
      input: {
        products: batch
      }
    })
  }

  logger.info("Successfully updated manage_inventory to false for all products.")
}
