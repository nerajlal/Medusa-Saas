import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function fixPricesSql({ container }: any) {
  const pricingModule = container.resolve(Modules.PRICING)
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const pgConnection = container.resolve("__pg_connection__")

  // 1. Get variants that need prices (all of them basically)
  const variants = await pgConnection.raw(`
     SELECT pv.id, p.tenant_id, pv.title 
     FROM product_variant pv
     JOIN product p ON pv.product_id = p.id
  `)
  
  console.log(`Fixing prices for ${variants.rows.length} variants found via SQL...`)

  for (const v of variants.rows) {
    if (!v.tenant_id) continue;
    
    console.log(`  Processing ${v.title} (${v.id}) for ${v.tenant_id}...`)
    try {
      const priceSets = await pricingModule.createPriceSets([{}])
      const psId = priceSets[0].id

      await remoteLink.create([{
        [Modules.PRODUCT]: { variant_id: v.id },
        [Modules.PRICING]: { price_set_id: psId }
      }])

      await pricingModule.addPrices([{
        price_set_id: psId,
        prices: [
          { currency_code: 'usd', amount: 99 },
          { currency_code: 'aed', amount: 365 },
          { currency_code: 'inr', amount: 8000 }
        ]
      }])
      console.log(`    ✅ Fixed!`)
    } catch (e) {
      if (e.message.includes("multiple links")) {
         console.log(`    ℹ️ Already has a price set link. Skipping.`)
      } else {
         console.error(`    ❌ Error: ${e.message}`)
      }
    }
  }
}
