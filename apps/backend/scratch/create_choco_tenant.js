const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'medusa_ecom',
  password: 'lion',
  port: 5432,
});

async function run() {
  await client.connect();
  console.log('🚀 Creating Choco Bliss Tenant...');

  try {
    // 1. Create Sales Channel
    const scId = `sc_choco_${Math.random().toString(36).substring(7)}`;
    await client.query(`
      INSERT INTO sales_channel (id, name, description, is_disabled, created_at, updated_at, metadata)
      VALUES ($1, $2, $3, $4, NOW(), NOW(), $5)
    `, [scId, 'Choco Bliss Store', 'High-conversion candy shop theme', false, JSON.stringify({ tenant_id: 'choco-bliss' })]);
    
    console.log(`✅ Created Sales Channel: ${scId}`);

    // 2. Create Store Setting
    const tsId = `ten_choco_${Math.random().toString(36).substring(7)}`;
    await client.query(`
      INSERT INTO store_settings (
        id, tenant_id, store_name, theme, storefront_url, s3_prefix, is_active, admin_email, sales_channel_id, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
    `, [
      tsId, 
      'choco-bliss', 
      'Choco Bliss', 
      'D', 
      'http://localhost:8003', 
      '/choco-bliss/', 
      true, 
      'choco@test.com', 
      scId
    ]);

    console.log(`✅ Created Store Setting: ${tsId}`);

    // 3. Link Sales Channel to Publishable Key (all keys for simplicity in dev)
    const keyRes = await client.query("SELECT id FROM publishable_api_key LIMIT 1;");
    if (keyRes.rows.length > 0) {
      const pkId = keyRes.rows[0].id;
      const linkId = `pksc_choco_${Math.random().toString(36).substring(7)}`;
      await client.query(`
        INSERT INTO publishable_api_key_sales_channel (id, publishable_key_id, sales_channel_id, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
      `, [linkId, pkId, scId]);
      console.log(`✅ Linked Sales Channel to Publishable Key: ${pkId}`);
    }

    // 4. Create some products for this tenant
    const products = [
      { title: 'Artisan Dark Chocolate Box', handle: 'artisan-dark', price: 2499, thumbnail: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000' },
      { title: 'Salted Caramel Truffles', handle: 'salted-caramel', price: 1899, thumbnail: 'https://images.unsplash.com/photo-1549007994-cb92cfd74483?q=80&w=1000' },
      { title: 'Milk Chocolate Bar (Pack of 5)', handle: 'milk-bar-pack', price: 1299, thumbnail: 'https://images.unsplash.com/photo-1511381939415-e4401546383d?q=80&w=1000' },
      { title: 'White Chocolate Raspberry', handle: 'white-raspberry', price: 2199, thumbnail: 'https://images.unsplash.com/photo-1510137600163-2729bc6959a6?q=80&w=1000' }
    ];

    for (const p of products) {
      const pId = `prod_choco_${Math.random().toString(36).substring(7)}`;
      await client.query(`
        INSERT INTO product (id, title, handle, thumbnail, created_at, updated_at, metadata, tenant_id)
        VALUES ($1, $2, $3, $4, NOW(), NOW(), $5, $6)
      `, [pId, p.title, p.handle, p.thumbnail, JSON.stringify({ tenant_id: 'choco-bliss' }), 'choco-bliss']);

      const vId = `variant_choco_${Math.random().toString(36).substring(7)}`;
      await client.query(`
        INSERT INTO product_variant (id, title, product_id, sku, inventory_quantity, created_at, updated_at, metadata, tenant_id)
        VALUES ($1, $2, $3, $4, 100, NOW(), NOW(), $5, $6)
      `, [vId, 'Default Variant', pId, `CHOC-${p.handle.toUpperCase()}`, JSON.stringify({ tenant_id: 'choco-bliss' }), 'choco-bliss']);

      // Link to Sales Channel
      const linkPscId = `psc_choco_${Math.random().toString(36).substring(7)}`;
      await client.query(`
        INSERT INTO product_sales_channel (id, product_id, sales_channel_id, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
      `, [linkPscId, pId, scId]);

      // Prices in EUR (region 01KM7JE76C7MV2S6BH3242AR0Q)
      const priceId = `price_choco_${Math.random().toString(36).substring(7)}`;
      await client.query(`
        INSERT INTO price (id, currency_code, amount, price_set_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
      `, [priceId, 'eur', p.price, `ps_${p.handle}`, '2026-04-10T00:00:00.000Z']);
      // Note: In Medusa v2, prices are complex. I'm simplifying for the demo data.
    }

    console.log('✅ Created 4 Products for Choco Bliss');
    console.log('🎉 Choco Bliss Tenant Setup Complete!');

  } catch (err) {
    console.error('❌ Error creating tenant:', err);
  } finally {
    await client.end();
  }
}

run();
