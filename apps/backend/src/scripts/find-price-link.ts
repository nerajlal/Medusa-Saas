export default async function findPriceLink({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  const res = await pgConnection.raw(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_name LIKE '%variant_price%'
  `)
  console.log("Price Link Tables:", res.rows)
}
