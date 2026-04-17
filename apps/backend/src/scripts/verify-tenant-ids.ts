import { ExecArgs } from "@medusajs/framework/types";

export default async function verifyTenantIds({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  
  await pgConnection.raw(`SET app.bypass_rls = 'true'`);
  const { rows } = await pgConnection.raw(`SELECT id, title, tenant_id FROM product`);
  
  console.log("All products in DB:");
  rows.forEach(r => console.log(`- [${r.tenant_id}] ${r.title}`));
}
