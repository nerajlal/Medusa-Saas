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
    console.log('--- Products for choco-bliss ---');
    const prodRes = await client.query("SELECT id, title, handle FROM product WHERE tenant_id = 'choco-bliss'");
    console.table(prodRes.rows);
    
    console.log('--- Categories ---');
    const catRes = await client.query("SELECT id, name, handle FROM product_category");
    console.table(catRes.rows);

    console.log('--- Current Product-Category Links ---');
    const linkRes = await client.query(`
      SELECT p.title as product, c.name as category 
      FROM product_category_product pcp
      JOIN product p ON pcp.product_id = p.id
      JOIN product_category c ON pcp.product_category_id = c.id
      WHERE p.tenant_id = 'choco-bliss'
    `);
    console.table(linkRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
