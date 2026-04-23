import { Modules } from "@medusajs/framework/utils"

export default async function addCurrenciesFixed({ container }: any) {
  const pricingModule = container.resolve(Modules.PRICING)
  const priceSets = await pricingModule.listPriceSets({})
  
  console.log(`Adding missing currencies to ${priceSets.length} price sets...`)

  for (const ps of priceSets) {
    try {
      await pricingModule.createPrices([
        { price_set_id: ps.id, currency_code: 'aed', amount: 365 },
        { price_set_id: ps.id, currency_code: 'inr', amount: 8000 }
      ])
      console.log(`  ✅ Created AED/INR for ${ps.id}`)
    } catch (e) {
      console.error(`  ❌ Error on ${ps.id}: ${e.message}`)
    }
  }
}
