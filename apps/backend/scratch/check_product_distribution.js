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
  const res = await client.query(`
    SELECT psc.sales_channel_id, sc.name, COUNT(psc.product_id) 
    FROM product_sales_channel psc
    JOIN sales_channel sc ON sc.id = psc.sales_channel_id
    GROUP BY psc.sales_channel_id, sc.name;
  `);
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}

run();
