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
    const scId = 'sc_choco_dxn23';
    
    // Find products in this SC that are NOT in any category
    const res = await client.query(`
      SELECT p.id, p.title, p.handle 
      FROM product p
      JOIN product_sales_channel psc ON p.id = psc.product_id
      LEFT JOIN product_category_product pcp ON p.id = pcp.product_id
      WHERE psc.sales_channel_id = $1 AND pcp.product_category_id IS NULL
    `, [scId]);
    
    console.log('Products in Choco Bliss SC with NO category:');
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
