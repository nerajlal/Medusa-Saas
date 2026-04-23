export default async function reassignRandomly({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  await pgConnection.raw(`SET app.bypass_rls = 'true'`)
  
  const tenants = ['nike-shop', 'apple-premium', 'adidas-boost', 'choco-bliss', 'raleys-market']
  
  const products = await pgConnection.raw(`SELECT id FROM product`)
  console.log(`Distributing ${products.rows.length} products across ${tenants.length} tenants...`)

  for (let i = 0; i < products.rows.length; i++) {
    const tenantId = tenants[i % tenants.length];
    const productId = products.rows[i].id;
    
    // Update product and all its variants to the same tenant
    await pgConnection.raw(`UPDATE product SET tenant_id = ? WHERE id = ?`, [tenantId, productId])
    await pgConnection.raw(`UPDATE product_variant SET tenant_id = ? WHERE product_id = ?`, [tenantId, productId])
  }
  
  console.log("Distribution complete.")
}
