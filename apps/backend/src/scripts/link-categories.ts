import { ExecArgs } from "@medusajs/framework/types"

export default async function linkCategories({ container }: ExecArgs) {
  const db = container.resolve("__pg_connection__")
  
  // Categorize 
  const catProduceId = "pcat_01KP3KVTFYCWYVY3AQ0AG6RTMK" // Fresh Produce
  const catPantryId = "pcat_01KP3KVTG0QKGW46AFK31YQA75"  // Pantry

  const productsResult = await db.raw(`SELECT id, title, handle FROM product WHERE tenant_id = 'raleys-market'`)
  
  console.log(`Linking ${productsResult.rows.length} products to categories...`)

  for (const p of productsResult.rows) {
    let catId = catPantryId
    
    // Assign Produce
    if (
      p.title.includes("Strawberries") || 
      p.title.includes("Avocado") || 
      p.title.includes("Spinach") ||
      p.title.includes("Milk") || 
      p.title.includes("Juice")
    ) {
      catId = catProduceId
    }

    try {
      await db.raw(
        `INSERT INTO product_category_product (product_id, product_category_id) 
         VALUES (?, ?) ON CONFLICT DO NOTHING`,
        [p.id, catId]
      )
    } catch (e: any) {
      console.log(`Already linked ${p.title}`)
    }
  }

  console.log("Done linking categories to Raleys products.")
}
