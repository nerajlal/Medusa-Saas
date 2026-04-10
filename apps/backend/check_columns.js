const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:lion@127.0.0.1:5432/medusa_ecom' });
async function run() {
  try {
    await client.connect();
    const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'order'");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
