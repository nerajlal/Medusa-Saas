import { ExecArgs } from "@medusajs/framework/types"

export default async function listCategories({ container }: ExecArgs) {
  const db = container.resolve("__pg_connection__")
  
  const result = await db.raw(`
    SELECT id, handle, name FROM product_category WHERE deleted_at IS NULL
  `)
  
  console.log("Existing categories:")
  for (const row of result.rows) {
    console.log(`- ${row.name} (handle: ${row.handle}, id: ${row.id})`)
  }
}
