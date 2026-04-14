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
    const res = await client.query("SELECT id, title, thumbnail, handle, metadata FROM product WHERE handle IN ('organic-apples', 'organic-bananas', 'whole-wheat-bread', 'almond-milk', 'free-range-eggs')");
    console.log('Products and Thumbnails:');
    console.table(res.rows);
    
    // Check images table if thumbnail is empty
    const imgRes = await client.query(`
      SELECT p.title, pi.url 
      FROM product p
      JOIN product_images pimg ON p.id = pimg.product_id
      JOIN image pi ON pimg.image_id = pi.id
      WHERE p.handle IN ('organic-apples', 'organic-bananas', 'whole-wheat-bread', 'almond-milk', 'free-range-eggs')
    `);
    console.log('Product Images:');
    console.table(imgRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
