import { ExecArgs } from "@medusajs/framework/types";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function addChocoCake({ container }: ExecArgs) {
  const workflow = createProductsWorkflow(container);
  const tenantId = "choco-bliss";
  
  console.log(`Adding "Chococake" through browser-equivalent logic for ${tenantId}...`);

  const pgConnection = container.resolve("__pg_connection__");
  await pgConnection.raw(`SET app.current_tenant_id = '${tenantId}'`);
  await pgConnection.raw(`SET app.bypass_rls = 'false'`);

  try {
    await workflow.run({
      input: {
        products: [{
          title: "Chococake",
          handle: "chococake",
          status: "published",
          options: [{ title: "Default Option", values: ["Default Value"] }],
          variants: [{
            title: "Default Variant",
            inventory_quantity: 50,
            prices: [{ currency_code: "usd", amount: 2500 }]
          }]
        }]
      }
    });
    console.log(`Success: "Chococake" is now live in Choco Bliss!`);
  } catch (e) {
    console.error(`Error adding Chococake:`, e.message);
  }
}
