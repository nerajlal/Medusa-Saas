export default async function checkTenantIdColumn({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  const res = await pgConnection.raw(`SELECT id, title, tenant_id FROM product`)
  console.log("Products tenant_id:", res.rows)
}
