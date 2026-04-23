import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function fixPricesGlobal({ container }: any) {
  const pricingModule = container.resolve(Modules.PRICING)
  const productModule = container.resolve(Modules.PRODUCT)
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const pgConnection = container.resolve("__pg_connection__")

  await pgConnection.raw(`SET app.bypass_rls = 'true'`)

  const variants = await productModule.listProductVariants({}, { relations: ["product"] })
  console.log(`Checking prices for ${variants.length} variants...`)

  for (const v of variants) {
    console.log(`  Processing ${v.title} (${v.id})...`)
    
    try {
      // 1. Create Price Set
      const priceSet = await pricingModule.createPriceSets([{}])
      const priceSetId = priceSet[0].id

      // 2. Link Variant to Price Set
      await remoteLink.create([{
        [Modules.PRODUCT]: { variant_id: v.id },
        [Modules.PRICING]: { price_set_id: priceSetId }
      }])

      // 3. Add Prices (UAE, USD, INR)
      await pricingModule.addPrices([{
        price_set_id: priceSetId,
        prices: [
          { currency_code: 'usd', amount: 99 },
          { currency_code: 'aed', amount: 365 },
          { currency_code: 'inr', amount: 8000 }
        ]
      }])
      console.log(`    ✅ Fixed!`)
    } catch (e) {
      console.error(`    ❌ Error: ${e.message}`)
    }
  }
}
