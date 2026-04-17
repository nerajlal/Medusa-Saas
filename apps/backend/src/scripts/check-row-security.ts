import { ExecArgs } from "@medusajs/framework/types";

export default async function checkRowSecurity({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  
  const { rows } = await pgConnection.raw("SHOW row_security");
  console.log("Global row_security setting:", rows[0]);
  
  const { rows: testRows } = await pgConnection.raw("SELECT id FROM product LIMIT 1");
  console.log("Can see products:", testRows.length > 0);
}
