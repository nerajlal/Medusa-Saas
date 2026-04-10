const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:lion@127.0.0.1:5432/medusa_ecom' });
async function run() {
  try {
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
    console.log(JSON.stringify(res.rows.map(t => t.table_name), null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
