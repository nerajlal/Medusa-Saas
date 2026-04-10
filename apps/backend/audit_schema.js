const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:lion@127.0.0.1:5432/medusa_ecom' });
async function run() {
  try {
    await client.connect();
    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log("Tables:", tables.rows.map(t => t.table_name).join(", "));
    
    const userCols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user'");
    console.log("User Columns:", JSON.stringify(userCols.rows, null, 2));
    
    const storeSettings = await client.query("SELECT * FROM information_schema.columns WHERE table_name = 'store_settings'");
    console.log("StoreSettings Columns:", JSON.stringify(storeSettings.rows.map(r => r.column_name), null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
