export default async function linkPkScSqlFix({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  
  const keys = await pgConnection.raw(`SELECT id FROM api_key WHERE type = 'publishable'`)
  const channels = await pgConnection.raw(`SELECT id FROM sales_channel`)

  console.log(`Found ${keys.rows.length} keys and ${channels.rows.length} channels.`)

  for (const key of keys.rows) {
    for (const channel of channels.rows) {
      try {
        const id = `pksc_${key.id.slice(-5)}_${channel.id.slice(-5)}`;
        await pgConnection.raw(`
          INSERT INTO publishable_api_key_sales_channel (id, publishable_key_id, sales_channel_id, created_at, updated_at)
          VALUES (?, ?, ?, NOW(), NOW())
          ON CONFLICT DO NOTHING
        `, [id, key.id, channel.id])
        console.log(`  Linked ${key.id} to ${channel.id}`)
      } catch (e) {
        console.error(`Error linking ${key.id} to ${channel.id}: ${e.message}`)
      }
    }
  }
  console.log("SQL linkage complete.")
}
