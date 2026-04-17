import { ExecArgs } from "@medusajs/framework/types";

export default async function queryProducts({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  const { rows } = await pgConnection.raw("SELECT id, title, tenant_id FROM product");
  console.log("Products:");
  rows.forEach(r => console.log(`- ${r.title} (Tenant ID: ${r.tenant_id})`));
}
