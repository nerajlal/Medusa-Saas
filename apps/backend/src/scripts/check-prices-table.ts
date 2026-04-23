export default async function checkPricesTable({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  const res = await pgConnection.raw(`
    SELECT p.id, p.currency_code, p.amount, ps.id as price_set_id, v.id as variant_id
    FROM price p
    JOIN price_set ps ON p.price_set_id = ps.id
    JOIN product_variant_price_set pvps ON pvps.price_set_id = ps.id
    JOIN product_variant v ON pvps.variant_id = v.id
  `)
  console.log("Prices in DB:", res.rows)
}
