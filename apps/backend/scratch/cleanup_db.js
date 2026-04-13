const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'medusa_ecom',
  password: 'lion',
  port: 5432,
});

const tenantsToKeep = ['nike-shop', 'apple-premium', 'adidas-boost'];

async function run() {
  await client.connect();
  console.log('🚀 Starting robust cleanup...');

  try {
    // 1. Get tenants to delete
    const res = await client.query("SELECT tenant_id FROM store_settings WHERE tenant_id NOT IN ($1, $2, $3);", tenantsToKeep);
    const tenantsToDelete = res.rows.map(r => r.tenant_id);

    if (tenantsToDelete.length === 0) {
      console.log('✅ No extra tenants to delete in store_settings.');
    } else {
      console.log(`🗑️ Deleting ${tenantsToDelete.length} tenants from store_settings: ${tenantsToDelete.join(', ')}`);
      for (const tid of tenantsToDelete) {
        await client.query("DELETE FROM store_settings WHERE tenant_id = $1", [tid]);
        console.log(`✅ Deleted tenant record: ${tid}`);
      }
    }

    // 2. Clean up other tables using metadata->>'tenant_id'
    // We target tables we know have tenant data
    const tablesWithMeta = [
      'product',
      'product_variant',
      'sales_channel',
      'region',
      'shipping_option',
      'cart',
      'order'
    ];

    const allTenantsToDelete = [
      'adidas_tenant',
      'adidas-v2',
      'tenant_a',
      'tenant_b',
      'tenant_c'
    ];

    for (const table of tablesWithMeta) {
      for (const tid of allTenantsToDelete) {
        try {
          const deleteRes = await client.query(`DELETE FROM "${table}" WHERE metadata->>'tenant_id' = $1`, [tid]);
          if (deleteRes.rowCount > 0) {
            console.log(`🗑️ Deleted ${deleteRes.rowCount} rows from ${table} for tenant ${tid}`);
          }
        } catch (e) {
          // Table might not exist or column missing, skip silently
        }
      }
    }

    console.log('🎉 Robust cleanup complete!');
  } catch (err) {
    console.error('❌ Error during cleanup:', err);
  } finally {
    await client.end();
  }
}

run();
