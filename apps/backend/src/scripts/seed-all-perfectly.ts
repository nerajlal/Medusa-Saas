import seedRaleysProducts from "./seed-raleys-products"
import { ExecArgs, Modules } from "@medusajs/framework/utils"

export default async function seedAllPerfectlyFix2({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__")
  
  // 1. Clean up
  console.log("Cleaning up existing products...")
  await pgConnection.raw(`SET app.bypass_rls = 'true'`)
  await pgConnection.raw(`DELETE FROM product_variant WHERE tenant_id != 'raleys-market'`)
  await pgConnection.raw(`DELETE FROM product WHERE tenant_id != 'raleys-market'`)
  
  const tenants = [
    { id: 'nike-shop', prefix: 'Nike', products: ['Pegasus 40', 'Air Max 2026', 'Zoom Fly 6'] },
    { id: 'apple-premium', prefix: 'Apple', products: ['iPhone 15 Pro', 'MacBook Air M3', 'AirPods Pro'] },
    { id: 'adidas-boost', prefix: 'Adidas', products: ['Ultraboost 1.0', 'NMD_R1', 'Stan Smith'] },
    { id: 'choco-bliss', prefix: 'Choco', products: ['Dark Chocolate Box', 'Milk Chocolate Bar', 'Truffle Collection'] }
  ]
  
  const productModule = container.resolve(Modules.PRODUCT)
  
  for (const t of tenants) {
    console.log(`Seeding ${t.id}...`)
    await pgConnection.raw(`SET app.current_tenant_id = '${t.id}'`)
    await pgConnection.raw(`SET app.bypass_rls = 'false'`)
    
    for (const name of t.products) {
      try {
        await productModule.createProducts([{
          title: `${t.prefix} ${name}`,
          handle: `${t.id}-${name.toLowerCase().replace(/ /g, '-')}`,
          status: 'published',
          variants: [
            {
              title: 'Default Variant',
              sku: `${t.id}-${name.slice(0,3)}-001`.toUpperCase(),
              manage_inventory: false,
              prices: [
                { currency_code: 'usd', amount: 99 },
                { currency_code: 'aed', amount: 365 },
                { currency_code: 'inr', amount: 8000 }
              ]
            }
          ]
        }])
        console.log(`  ✅ ${t.prefix} ${name}`)
      } catch (e) {
        console.error(`  ❌ Error seeding ${name}: ${e.message}`)
      }
    }
  }
  
  // Set tenant_id column via raw SQL
  await pgConnection.raw(`SET app.bypass_rls = 'true'`)
  for (const t of tenants) {
    await pgConnection.raw(`UPDATE product SET tenant_id = ? WHERE title LIKE ?`, [t.id, `${t.prefix} %`])
    await pgConnection.raw(`UPDATE product_variant SET tenant_id = ? WHERE sku LIKE ?`, [t.id, `${t.id.toUpperCase()}-%`])
  }

  console.log("Seeding complete.")
}
