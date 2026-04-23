export default async function reassignProducts({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  
  // Clone some nike products for apple
  console.log("Cloning products for apple-premium and adidas-boost...")
  
  const nikeProducts = await pgConnection.raw(`SELECT * FROM product WHERE tenant_id = 'nike-shop' LIMIT 5`)
  
  for (const p of nikeProducts.rows) {
    // Apple
    const appleHandle = `apple-${p.handle}`;
    await pgConnection.raw(`
      INSERT INTO product (id, title, handle, subtitle, description, status, thumbnail, tenant_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [`prod_apple_${p.id.slice(-10)}`, `Premium ${p.title}`, appleHandle, p.subtitle, p.description, p.status, p.thumbnail, 'apple-premium'])
    
    // Adidas
    const adidasHandle = `adidas-${p.handle}`;
    await pgConnection.raw(`
      INSERT INTO product (id, title, handle, subtitle, description, status, thumbnail, tenant_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [`prod_adidas_${p.id.slice(-10)}`, `Boost ${p.title}`, adidasHandle, p.subtitle, p.description, p.status, p.thumbnail, 'adidas-boost'])
  }
  
  console.log("Reassignment complete. Please run perfect-sync.ts to link new products to channels.")
}
