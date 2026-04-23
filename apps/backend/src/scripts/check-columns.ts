export default async function checkColumns({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  const res = await pgConnection.raw(`
    SELECT column_name, ordinal_position 
    FROM information_schema.columns 
    WHERE table_name = 'product' 
    ORDER BY ordinal_position
  `)
  console.log("Columns:", res.rows)
}
