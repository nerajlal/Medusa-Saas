const { Client } = require('pg');

async function seed() {
    const client = new Client({
        connectionString: 'postgres://postgres:lion@127.0.0.1:5432/medusa_ecom'
    });
    
    await client.connect();
    console.log("Connected to DB...");

    const updates = [
        { id: 'nike-shop', email: 'nike@test.com' },
        { id: 'apple-premium', email: 'apple@test.com' },
        { id: 'adidas-boost', email: 'adidas@test.com' },
        { id: 'adidas_tenant', email: 'adidas@test.com' }
    ];

    for (const u of updates) {
        await client.query('UPDATE store_settings SET admin_email = $1 WHERE tenant_id = $2', [u.email, u.id]);
    }

    await client.end();
    console.log("Emails updated successfully!");
}

seed();
