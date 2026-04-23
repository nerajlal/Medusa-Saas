export default async function fixClonesV2Tenant({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  await pgConnection.raw(`SET app.bypass_rls = 'true'`)
  
  const tenants = ['apple-premium', 'adidas-boost']
  
  for (const tenantId of tenants) {
    console.log(`Cloning variants for ${tenantId}...`)
    const products = await pgConnection.raw(`SELECT id, title FROM product WHERE tenant_id = ?`, [tenantId])
    
    for (const p of products.rows) {
      const sourceTitle = p.title.replace('Premium ', '').replace('Boost ', '');
      const sourceProducts = await pgConnection.raw(`SELECT id FROM product WHERE title = ? AND tenant_id = 'nike-shop' LIMIT 1`, [sourceTitle])
      
      if (sourceProducts.rows.length > 0) {
        const sourceId = sourceProducts.rows[0].id;
        const variants = await pgConnection.raw(`SELECT * FROM product_variant WHERE product_id = ?`, [sourceId])
        console.log(`  Found ${variants.rows.length} source variants for ${sourceTitle} (${sourceId})`)

        for (const v of variants.rows) {
          const uniqueSuffix = Math.floor(Math.random()*10000);
          const newVariantId = `pv_${tenantId.slice(0,3)}_${v.id.slice(-10)}_${uniqueSuffix}`;
          await pgConnection.raw(`
            INSERT INTO product_variant (id, product_id, title, sku, barcode, manage_inventory, tenant_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ON CONFLICT DO NOTHING
          `, [newVariantId, p.id, v.title, `${tenantId}-${v.sku || v.title}-${uniqueSuffix}`, v.barcode, false, tenantId])
          
          const prices = await pgConnection.raw(`SELECT * FROM price WHERE variant_id = ?`, [v.id])
          for (const price of prices.rows) {
             await pgConnection.raw(`
               INSERT INTO price (id, variant_id, currency_code, amount, rules_count, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, NOW(), NOW())
               ON CONFLICT DO NOTHING
             `, [`pr_${newVariantId.slice(-10)}_${price.currency_code}`, newVariantId, price.currency_code, price.amount, 0])
          }
        }
      }
    }
  }
}
