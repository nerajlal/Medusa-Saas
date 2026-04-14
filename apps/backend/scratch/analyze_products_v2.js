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
  try {
    console.log('--- All Products with Metadata ---');
    const prodRes = await client.query("SELECT id, title, handle, metadata FROM product");
    const chocoProducts = prodRes.rows.filter(p => {
      if (!p.metadata) return false;
      return p.metadata.tenant_id === 'choco-bliss' || p.metadata.tenant === 'choco-bliss';
    });
    console.table(chocoProducts);
    
    console.log('--- All Categories ---');
    const catRes = await client.query("SELECT id, name, handle FROM product_category");
    console.table(catRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
