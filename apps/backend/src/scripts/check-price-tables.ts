import { ExecArgs } from "@medusajs/framework/types"

export default async function checkPriceTables({ container }: ExecArgs) {
  const db = container.resolve("__pg_connection__")
  
  const result = await db.raw(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema='public' AND (table_name LIKE '%price%' OR table_name LIKE '%money%')
    ORDER BY table_name
  `)
  
  console.log("Price-related tables:")
  for (const row of result.rows) {
    console.log(" -", row.table_name)
  }

  // Also check product_variant columns
  const varResult = await db.raw(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name='product_variant' ORDER BY ordinal_position
  `)
  console.log("\nproduct_variant columns:")
  for (const row of varResult.rows) {
    console.log(" -", row.column_name)
  }
}
