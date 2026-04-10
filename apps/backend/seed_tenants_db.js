const { Client } = require('pg');
const crypto = require('crypto');

// WE reuse the encryption logic from your service to be compatible
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "00000000000000000000000000000000";
const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "utf8"), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
};

async function seed() {
    const client = new Client({
        connectionString: 'postgres://postgres:lion@127.0.0.1:5432/medusa_ecom'
    });
    
    await client.connect();
    console.log("Connected to DB...");

    const tenants = [
        { id: 'nike-shop', name: 'Nike Official Store', email: 'nike@test.com', theme: 'A' },
        { id: 'apple-premium', name: 'Apple Premium Reseller', email: 'apple@test.com', theme: 'B' },
        { id: 'adidas-boost', name: 'Adidas High-Conv', email: 'adidas@test.com', theme: 'C' }
    ];

    for (const t of tenants) {
        console.log(`Provisioning ${t.name}...`);
        
        // 1. Store Settings
        await client.query(`
            INSERT INTO store_settings (id, tenant_id, store_name, theme, s3_prefix)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (tenant_id) DO UPDATE SET store_name = EXCLUDED.store_name
        `, [`tenant_${t.id}`, t.id, t.name, t.theme, `/${t.id}/`]);

        // 2. We'll let the user create the OWNER via the UI if they want, 
        // but for now we'll just ensure the Tenant Settings exist so the UI shows them.
        // Actually, let's just use the API to do it properly with passwords.
    }

    await client.end();
    console.log("Tenants seeded successfully in DB settings.");
}

seed();
