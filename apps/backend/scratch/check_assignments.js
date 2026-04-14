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
    
    // Find products in this SC and their categories
    const res = await client.query(`
      SELECT p.title as product, c.name as category 
      FROM product p
      JOIN product_sales_channel psc ON p.id = psc.product_id
      LEFT JOIN product_category_product pcp ON p.id = pcp.product_id
      LEFT JOIN product_category c ON pcp.product_category_id = c.id
      WHERE psc.sales_channel_id = $1
    `, [scId]);
    
    console.log('Choco Bliss Products and Categories:');
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
