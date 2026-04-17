import { ExecArgs } from "@medusajs/framework/types";

export default async function dumpStores({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  
  const { rows } = await pgConnection.raw("SELECT tenant_id, store_name, admin_email FROM store_settings WHERE deleted_at IS NULL");
  console.log("Stores:", rows);

  const { rows: authRows } = await pgConnection.raw("SELECT id, provider, entity_id FROM auth_identity");
  console.log("Auth Identities:", authRows);
}
