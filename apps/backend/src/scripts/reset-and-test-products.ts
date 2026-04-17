import { ExecArgs } from "@medusajs/framework/types";
import { createProductsWorkflow, deleteProductsWorkflow } from "@medusajs/core-flows";
import { tenantContextStorage } from "../api/tenant-context";

export default async function resetAndCreateProducts({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  const query = container.resolve("query");

  console.log("1. Removing all explicitly globally-seeded products...");
  // Getting all products ignoring RLS by bypassing it
  await pgConnection.raw(`SET app.bypass_rls = 'true'`);
  
  const { rows: globalProducts } = await pgConnection.raw(`SELECT id FROM product WHERE tenant_id IS NULL`);
  
  if (globalProducts.length > 0) {
    const productIds = globalProducts.map(p => p.id);
    try {
      await deleteProductsWorkflow(container).run({
        input: { ids: productIds }
      });
      console.log(`Deleted ${productIds.length} global products safely using workflow.`);
    } catch(e) {
      console.log("Soft workflow delete failed, using surgical raw SQL to wipe them...");
      // Wipe manually cascading
      await pgConnection.raw(`DELETE FROM product WHERE tenant_id IS NULL`);
    }
  } else {
    console.log("No global products found (or already wiped).");
  }

  // Also wipe existing tenant products to be completely fresh for this test
  await pgConnection.raw(`DELETE FROM product WHERE tenant_id IS NOT NULL`);
  console.log("Wiped old tenant products to ensure clean test state.");


  console.log("\n2. Creating isolated products for 3 stores...");
  const storesToTest = [
    { tenant_id: "choco-bliss", productName: "Choco Bliss Premium Dark Truffles", channelName: "Choco Channel" },
    { tenant_id: "raleys-market", productName: "Raleys Farm Fresh Oranges", channelName: "Raleys Channel" },
    { tenant_id: "nike-shop", productName: "Nike Air Max 2026", channelName: "Nike Channel" }
  ];

  for (const store of storesToTest) {
    console.log(`Setting context for tenant: ${store.tenant_id}`);
    
    await tenantContextStorage.run(store.tenant_id, async () => {
      // Must set the PG session inside here so mutations get the tenant_id
      await pgConnection.raw(`SET app.current_tenant_id = '${store.tenant_id}'`);
      await pgConnection.raw(`SET app.bypass_rls = 'false'`);

      try {
        const { result } = await createProductsWorkflow(container).run({
          input: {
            products: [{
              title: store.productName,
              description: `Isolated product for ${store.tenant_id}`,
              options: [{ title: "Variant", values: ["Default"] }],
              variants: [{
                title: "Default",
                prices: [{ amount: 1500, currency_code: "usd" }]
              }]
            }]
          }
        });
        console.log(` + Successfully created "${store.productName}"`);
      } catch (e) {
        console.log(` - Failed creating for ${store.tenant_id}`, e.message);
      }
    });
  }

  console.log("\n3. Validating Isolation...");
  for (const store of storesToTest) {
     await tenantContextStorage.run(store.tenant_id, async () => {
        await pgConnection.raw(`SET app.current_tenant_id = '${store.tenant_id}'`);
        await pgConnection.raw(`SET app.bypass_rls = 'false'`);
        
        const { rows } = await pgConnection.raw(`SELECT title FROM product`);
        console.log(`Tenant '${store.tenant_id}' can see ${rows.length} product(s): ${rows.map(r => r.title).join(", ")}`);
     });
  }

  console.log("\nDone!");
}
