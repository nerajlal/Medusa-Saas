import { Modules } from "@medusajs/framework/utils"

export default async function disableInventory({ container }: any) {
  const productModule = container.resolve(Modules.PRODUCT)
  const pgConnection = container.resolve("__pg_connection__")

  const tenants = ['nike-shop', 'apple-premium', 'adidas-boost', 'choco-bliss', 'raleys-market']

  for (const tenantId of tenants) {
    console.log(`Disabling inventory for ${tenantId}...`)
    await pgConnection.raw(`SET app.current_tenant_id = '${tenantId}'`)
    
    // Get all variants
    const variants = await pgConnection.raw(`SELECT id FROM product_variant`)
    
    const variantIds = variants.rows.map((v: any) => v.id)
    if (variantIds.length > 0) {
      // Set manage_inventory to false
      await pgConnection.raw(`UPDATE product_variant SET manage_inventory = false WHERE id = ANY(?)`, [variantIds])
      console.log(`  Updated ${variantIds.length} variants.`)
    }
  }
}
