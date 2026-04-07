import { ExecArgs, Modules } from "@medusajs/framework/utils"

export default async function seed({ container }: ExecArgs) {
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const storeSettingsService = container.resolve("storeSettings" as any)
  const productModule = container.resolve(Modules.PRODUCT)

  console.log("🌱 Seeding Multi-Tenant Data...")

  // 1. Create Sales Channels for each storefront
  const channels = await salesChannelModule.create([
    { name: "Storefront A (Minimal)", description: "Channel for Theme A" },
    { name: "Storefront B (Premium)", description: "Channel for Theme B" },
    { name: "Storefront C (High-Conv)", description: "Channel for Theme C" },
  ])

  console.log(`✅ Created ${channels.length} Sales Channels`)

  // 2. Create Sample Tenant Settings
  const tenantA = await storeSettingsService.createStoreTenantSettings({
    tenant_id: "tenant_a",
    store_name: "Minimalist Shop",
    theme: "A",
    sales_channel_id: channels[0].id,
    storefront_url: "http://localhost:3001"
  })

  const tenantB = await storeSettingsService.createStoreTenantSettings({
    tenant_id: "tenant_b",
    store_name: "Premium Noir",
    theme: "B",
    sales_channel_id: channels[1].id,
    storefront_url: "http://localhost:3002",
    phonepe_merchant_id: "MID_TENANT_B",
    phonepe_api_key: "FAKE_KEY_B_12345"
  })

  console.log(`✅ Created Sample Tenants: tenant_a, tenant_b`)

  // 3. Create Sample Products for Tenant A
  await productModule.create([
    {
      title: "Clean Minimalist Chair",
      handle: "minimalist-chair",
      description: "A very clean chair for Tenant A",
      metadata: { tenant_id: "tenant_a" },
      status: "published",
      variants: [{ title: "White", prices: [{ amount: 15000, currency_code: "inr" }] }]
    }
  ])

  console.log("🚀 Seeding Complete!")
}
