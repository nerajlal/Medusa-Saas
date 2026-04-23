import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function fixAppleAdidasPricesDebug({ container }: any) {
  const pricingModule = container.resolve(Modules.PRICING)
  const productModule = container.resolve(Modules.PRODUCT)
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const pgConnection = container.resolve("__pg_connection__")

  await pgConnection.raw(`SET app.bypass_rls = 'true'`)

  const variants = await productModule.listProductVariants({}, { relations: ["product"] })
  console.log(`Total variants: ${variants.length}`)

  for (const v of variants) {
    console.log(`  Variant: ${v.title}, Product: ${v.product?.title}, ProductTenant: ${v.product?.tenant_id}`)
    // ...
  }
}
