import { ExecArgs } from "@medusajs/framework/types";

export default async function checkDetailedRLS({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  
  const { rows: userRows } = await pgConnection.raw("SELECT CURRENT_USER");
  const currentUser = userRows[0].current_user;
  console.log("Current DB User:", currentUser);

  const { rows: tableRows } = await pgConnection.raw(`
    SELECT relname, relowner::regrole, relrowsecurity, relforcerowsecurity 
    FROM pg_class 
    JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
    WHERE relname = 'product' AND nspname = 'public'
  `);
  console.log("Product Table RLS Info:", tableRows[0]);
  
  const { rows: policyRows } = await pgConnection.raw(`
    SELECT * FROM pg_policies WHERE tablename = 'product'
  `);
  console.log("Policies:", policyRows);
}
