import { ExecArgs } from "@medusajs/framework/types";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function urgentSeed({ container }: ExecArgs) {
  const workflow = createProductsWorkflow(container);
  
  const tenants = [
    {
      id: "choco-bliss",
      products: [
        { title: "Choco Bliss Dark Truffles", handle: "choco-truffles", thumbnail: "" },
        { title: "Milk Chocolate Hazelnut Bar", handle: "choco-hazelnut", thumbnail: "" },
        { title: "White Chocolate Rose Creams", handle: "choco-rose", thumbnail: "" }
      ]
    },
    {
      id: "raleys-market",
      products: [
        { title: "Raleys Organic Strawberries", handle: "raleys-strawberries", thumbnail: "" },
        { title: "Fresh Avocado Pack", handle: "raleys-avocado", thumbnail: "" },
        { title: "Whole Grain Sourdough", handle: "raleys-bread", thumbnail: "" }
      ]
    },
    {
      id: "nike-shop",
      products: [
        { title: "Nike Air Max 2026", handle: "nike-air-max", thumbnail: "" },
        { title: "Nike Zoom Fly 6", handle: "nike-zoom", thumbnail: "" },
        { title: "Nike Pegasus 40", handle: "nike-pegasus", thumbnail: "" }
      ]
    }
  ];

  console.log("Urgent Product Addition Started...");

  for (const tenant of tenants) {
    console.log(`Adding products for tenant: ${tenant.id}`);
    
    // Set the session variable for the current tenant so NOT NULL check passes
    const pgConnection = container.resolve("__pg_connection__");
    await pgConnection.raw(`SET app.current_tenant_id = '${tenant.id}'`);
    await pgConnection.raw(`SET app.bypass_rls = 'false'`);

    for (const product of tenant.products) {
      try {
        await workflow.run({
          input: {
            products: [{
              ...product,
              status: "published",
              options: [{ title: "Default Option", values: ["Default Value"] }],
              variants: [{
                title: "Default Variant",
                inventory_quantity: 100,
                prices: [{ currency_code: "usd", amount: 1000 }]
              }]
            }]
          }
        });
        console.log(` + Created ${product.title}`);
      } catch (e) {
        console.error(` - Failed to create ${product.title}:`, e.message);
      }
    }
  }

  console.log("Urgent Addition Complete!");
}
