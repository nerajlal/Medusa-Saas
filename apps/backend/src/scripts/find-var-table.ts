export default async function findVarTable({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  const res = await pgConnection.raw(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_name LIKE '%variant%'
  `)
  console.log("Variant Tables:", res.rows)
}
