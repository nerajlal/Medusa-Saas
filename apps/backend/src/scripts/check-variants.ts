export default async function checkVariants({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  const res = await pgConnection.raw(`
    SELECT pv.id, pv.product_id, p.title as product_title, p.tenant_id 
    FROM product_variant pv
    JOIN product p ON pv.product_id = p.id
    WHERE p.tenant_id IN ('apple-premium', 'adidas-boost')
  `)
  console.log("Variants found for Apple/Adidas:", res.rows)
}
