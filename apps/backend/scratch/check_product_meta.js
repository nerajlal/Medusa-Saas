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
  const res = await client.query("SELECT id, title, metadata FROM product LIMIT 5;");
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}

run();
