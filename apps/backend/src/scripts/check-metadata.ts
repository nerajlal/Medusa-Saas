export default async function checkProductMetadata({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  const res = await pgConnection.raw(`SELECT id, title, metadata FROM product`)
  console.log("Products found:", res.rows)
}
