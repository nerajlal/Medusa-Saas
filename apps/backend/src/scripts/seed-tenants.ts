import { ExecArgs, Modules } from "@medusajs/framework/utils"

export default async function seed({ container }: ExecArgs) {
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const productModule = container.resolve(Modules.PRODUCT)
  const dbConnection = container.resolve("__pg_connection__") as any

  console.log("🌱 Seeding Multi-Tenant Data...")

  // 1. Create Sales Channels for each storefront
  const channels = await salesChannelModule.createSalesChannels([
    { name: "Storefront A (Minimal)", description: "Channel for Theme A" },
    { name: "Storefront B (Premium)", description: "Channel for Theme B" },
    { name: "Storefront C (High-Conv)", description: "Channel for Theme C" },
  ])

  console.log(`✅ Created ${channels.length} Sales Channels`)

  // 2. Create Sample Tenant Settings (Raw SQL for stability in exec)
  const tenants = [
    { id: "tenant_a", name: "Minimalist Shop", theme: "A", channelId: channels[0].id, url: "http://localhost:8000" },
    { id: "tenant_b", name: "Premium Noir", theme: "B", channelId: channels[1].id, url: "http://localhost:8001" },
    { id: "tenant_c", name: "Active Convex", theme: "C", channelId: channels[2].id, url: "http://localhost:8002" },
  ]

  for (const t of tenants) {
    await dbConnection.raw(`
      INSERT INTO store_settings (id, tenant_id, store_name, theme, sales_channel_id, storefront_url, s3_prefix)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (tenant_id) DO UPDATE SET 
        store_name = EXCLUDED.store_name,
        theme = EXCLUDED.theme,
        sales_channel_id = EXCLUDED.sales_channel_id,
        storefront_url = EXCLUDED.storefront_url
    `, [`ten_${t.id}`, t.id, t.name, t.theme, t.channelId, t.url, `/${t.id}/`]);
  }

  console.log(`✅ Created Sample Tenants: tenant_a, tenant_b, tenant_c`)

  // 3. Create Sample Products for Tenant A
  await productModule.createProducts([
    {
      title: "Clean Minimalist Chair",
      handle: "minimalist-chair",
      description: "A very clean chair for Tenant A",
      metadata: { tenant_id: "tenant_a" },
      status: "published" as any,
      options: [{ title: "Color", values: ["White"] }],
      variants: [{ title: "White", options: { Color: "White" }, prices: [{ amount: 15000, currency_code: "inr" }] }]
    }
  ])

  // Sample Products for Tenant B
  await productModule.createProducts([
    {
      title: "Midnight Chronograph",
      handle: "midnight-watch",
      description: "A premium timepiece for Tenant B",
      metadata: { tenant_id: "tenant_b" },
      status: "published" as any,
      options: [{ title: "Style", values: ["Classic"] }],
      variants: [{ title: "Classic", options: { Style: "Classic" }, prices: [{ amount: 125000, currency_code: "inr" }] }]
    }
  ])

  // Sample Products for Tenant C
  await productModule.createProducts([
    {
      title: "Nitro Boost Runner",
      handle: "nitro-runner",
      description: "High performance shoes for Tenant C",
      metadata: { tenant_id: "tenant_c" },
      status: "published" as any,
      options: [{ title: "Size", values: ["42"] }],
      variants: [{ title: "42", options: { Size: "42" }, prices: [{ amount: 8900, currency_code: "inr" }] }]
    }
  ])

  console.log("🚀 Seeding Complete!")
}


