import { ExecArgs } from "@medusajs/framework/types";

export default async function checkDBUser({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  const { rows } = await pgConnection.raw("SELECT current_user, is_superuser");
  console.log("DB User Info:", rows[0]);
  
  const { rows: tables } = await pgConnection.raw("SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'product'");
  console.log("Table RLS Info:", tables[0]);
}
