const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:lion@127.0.0.1:5432/medusa_ecom' });
async function run() {
  try {
    await client.connect();
    
    const authCols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'auth_identity'");
    console.log("AuthIdentity Columns:", JSON.stringify(authCols.rows, null, 2));
    
    const providerCols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'provider_identity'");
    console.log("ProviderIdentity Columns:", JSON.stringify(providerCols.rows, null, 2));

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
