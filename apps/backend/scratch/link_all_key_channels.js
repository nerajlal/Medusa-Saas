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
  const keyId = 'apk_01KM7JE73NMV6X8MP68EMYHJ7F';
  
  // Fetch all sales channel IDs
  const res = await client.query("SELECT id FROM sales_channel;");
  const channelIds = res.rows.map(r => r.id);

  for (const channelId of channelIds) {
    const id = `pksc_${Math.random().toString(36).substring(7)}${Math.random().toString(36).substring(7)}`;
    await client.query(`
      INSERT INTO publishable_api_key_sales_channel (id, publishable_key_id, sales_channel_id, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [id, keyId, channelId]);
  }
  
  console.log('✅ Linked Publishable Key to ALL Sales Channels');
  await client.end();
}

run();
