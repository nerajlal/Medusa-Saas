import { ExecArgs } from "@medusajs/framework/types"

export default async function checkCategoryTables({ container }: ExecArgs) {
  const db = container.resolve("__pg_connection__")
  
  const result = await db.raw(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema='public' AND (table_name LIKE '%category%')
    ORDER BY table_name
  `)
  
  console.log("Category-related tables:")
  for (const row of result.rows) {
    console.log(" -", row.table_name)
  }
}
