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
    const res = await client.query('SELECT id, email FROM "user"');
    console.log('Admin Users:');
    console.table(res.rows);
    
    const authRes = await client.query('SELECT id, entity_id FROM auth_identity');
    console.log('Auth Identities:');
    console.table(authRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
