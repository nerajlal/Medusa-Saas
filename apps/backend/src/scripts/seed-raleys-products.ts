import { ExecArgs } from "@medusajs/framework/types"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function seedRaleysProducts({ container }: ExecArgs) {
  const tenantId = "raleys-market"

  // Set tenant context for RLS
  const pgConnection = container.resolve("__pg_connection__")
  await pgConnection.raw(`SET app.current_tenant_id = '${tenantId}'`)
  await pgConnection.raw(`SET app.bypass_rls = 'false'`)

  const workflow = createProductsWorkflow(container)

  const products = [
    // ── Fruits & Vegetables (3 products) ──
    {
      title: "Organic Strawberries",
      handle: "raleys-organic-strawberries",
      status: "published" as const,
      description: "Sweet, juicy organic strawberries from California farms. Perfect for desserts and snacking.",
      options: [{ title: "Pack Size", values: ["1 lb", "2 lb", "5 lb"] }],
      variants: [
        { title: "1 lb Pack", prices: [{ currency_code: "usd", amount: 499 }], inventory_quantity: 200 },
        { title: "2 lb Pack", prices: [{ currency_code: "usd", amount: 899 }], inventory_quantity: 150 },
        { title: "5 lb Family Pack", prices: [{ currency_code: "usd", amount: 1999 }], inventory_quantity: 80 },
      ],
    },
    {
      title: "Fresh Avocado Pack",
      handle: "raleys-fresh-avocado",
      status: "published" as const,
      description: "Hass avocados, perfectly ripe and ready to eat. Great for guacamole, toast, and salads.",
      options: [{ title: "Quantity", values: ["3 Pack", "6 Pack"] }],
      variants: [
        { title: "3 Pack", prices: [{ currency_code: "usd", amount: 599 }], inventory_quantity: 300 },
        { title: "6 Pack", prices: [{ currency_code: "usd", amount: 1099 }], inventory_quantity: 180 },
      ],
    },
    {
      title: "Baby Spinach Organic",
      handle: "raleys-baby-spinach",
      status: "published" as const,
      description: "Triple-washed organic baby spinach. Ready to eat right out of the bag.",
      options: [{ title: "Size", values: ["5 oz", "16 oz"] }],
      variants: [
        { title: "5 oz Bag", prices: [{ currency_code: "usd", amount: 349 }], inventory_quantity: 250 },
        { title: "16 oz Family Size", prices: [{ currency_code: "usd", amount: 599 }], inventory_quantity: 120 },
      ],
    },

    // ── Bakery (2 products) ──
    {
      title: "Whole Grain Sourdough Loaf",
      handle: "raleys-sourdough-loaf",
      status: "published" as const,
      description: "Artisan whole grain sourdough bread baked fresh daily in our in-store bakery.",
      options: [{ title: "Type", values: ["Regular", "Sliced"] }],
      variants: [
        { title: "Regular Loaf", prices: [{ currency_code: "usd", amount: 549 }], inventory_quantity: 100 },
        { title: "Sliced Loaf", prices: [{ currency_code: "usd", amount: 599 }], inventory_quantity: 100 },
      ],
    },
    {
      title: "Blueberry Muffins 4-Pack",
      handle: "raleys-blueberry-muffins",
      status: "published" as const,
      description: "Moist blueberry muffins with a buttery crumb topping. Baked fresh every morning.",
      options: [{ title: "Default Option", values: ["Default Value"] }],
      variants: [
        { title: "4-Pack", prices: [{ currency_code: "usd", amount: 699 }], inventory_quantity: 80 },
      ],
    },

    // ── Dairy & Eggs (2 products) ──
    {
      title: "Raley's Organic Whole Milk",
      handle: "raleys-organic-milk",
      status: "published" as const,
      description: "USDA Organic whole milk from pasture-raised cows. No antibiotics, no hormones.",
      options: [{ title: "Size", values: ["Half Gallon", "Gallon"] }],
      variants: [
        { title: "Half Gallon", prices: [{ currency_code: "usd", amount: 449 }], inventory_quantity: 200 },
        { title: "Gallon", prices: [{ currency_code: "usd", amount: 699 }], inventory_quantity: 150 },
      ],
    },
    {
      title: "Free-Range Large Eggs",
      handle: "raleys-free-range-eggs",
      status: "published" as const,
      description: "Cage-free, free-range large brown eggs. Farm fresh quality you can taste.",
      options: [{ title: "Count", values: ["12 ct", "18 ct", "36 ct"] }],
      variants: [
        { title: "12 Count", prices: [{ currency_code: "usd", amount: 499 }], inventory_quantity: 300 },
        { title: "18 Count", prices: [{ currency_code: "usd", amount: 699 }], inventory_quantity: 200 },
        { title: "36 Count Value Pack", prices: [{ currency_code: "usd", amount: 1199 }], inventory_quantity: 100 },
      ],
    },

    // ── Meat & Seafood (2 products) ──
    {
      title: "USDA Choice Angus Ribeye Steak",
      handle: "raleys-angus-ribeye",
      status: "published" as const,
      description: "Premium USDA Choice Angus ribeye, hand-cut by our in-store butchers. Rich marbling for maximum flavor.",
      options: [{ title: "Weight", values: ["12 oz", "16 oz"] }],
      variants: [
        { title: "12 oz Cut", prices: [{ currency_code: "usd", amount: 1599 }], inventory_quantity: 60 },
        { title: "16 oz Cut", prices: [{ currency_code: "usd", amount: 2099 }], inventory_quantity: 40 },
      ],
    },
    {
      title: "Wild-Caught Alaskan Salmon Fillet",
      handle: "raleys-salmon-fillet",
      status: "published" as const,
      description: "Premium wild-caught sockeye salmon from Alaska. Sustainably sourced and never farmed.",
      options: [{ title: "Default Option", values: ["Default Value"] }],
      variants: [
        { title: "8 oz Fillet", prices: [{ currency_code: "usd", amount: 1299 }], inventory_quantity: 50 },
      ],
    },

    // ── Beverages (1 product) ──
    {
      title: "Cold-Pressed Green Juice",
      handle: "raleys-green-juice",
      status: "published" as const,
      description: "A refreshing blend of kale, cucumber, celery, green apple, and ginger. No added sugar.",
      options: [{ title: "Size", values: ["12 oz", "32 oz"] }],
      variants: [
        { title: "12 oz Bottle", prices: [{ currency_code: "usd", amount: 799 }], inventory_quantity: 150 },
        { title: "32 oz Family Jug", prices: [{ currency_code: "usd", amount: 1899 }], inventory_quantity: 60 },
      ],
    },
  ]

  console.log(`\n🛒 Seeding ${products.length} products for Raley's Market (${tenantId})...\n`)

  for (const product of products) {
    try {
      // Reset tenant context before each product (in case workflow resets it)
      await pgConnection.raw(`SET app.current_tenant_id = '${tenantId}'`)
      await pgConnection.raw(`SET app.bypass_rls = 'false'`)

      await workflow.run({
        input: { products: [product] },
      })
      const variantCount = product.variants.length
      console.log(`  ✅ ${product.title} (${variantCount} variant${variantCount > 1 ? 's' : ''})`)
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        console.log(`  ⏭️  ${product.title} — already exists, skipping`)
      } else {
        console.error(`  ❌ ${product.title} — ${e.message}`)
      }
    }
  }

  console.log(`\n✅ Raley's Market seeding complete!\n`)
}
