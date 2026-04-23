export default async function checkUniqueTenants({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  const res = await pgConnection.raw(`SELECT DISTINCT tenant_id FROM product`)
  console.log("Unique Tenant IDs in product table:", res.rows)
}
