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
    const settingsRes = await client.query("SELECT * FROM store_settings WHERE tenant_id = 'choco-bliss'");
    console.log('Store Settings:');
    console.table(settingsRes.rows);
    
    if (settingsRes.rows.length > 0) {
      const scId = settingsRes.rows[0].sales_channel_id;
      console.log(`Sales Channel ID: ${scId}`);
      
      const prodRes = await client.query(`
        SELECT p.id, p.title, p.handle 
        FROM product p
        JOIN product_sales_channel psc ON p.id = psc.product_id
        WHERE psc.sales_channel_id = $1
      `, [scId]);
      console.log('Products in Choco Bliss Sales Channel:');
      console.table(prodRes.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
