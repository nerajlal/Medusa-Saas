const { Client } = require('pg');

async function secureUsers() {
    const client = new Client({
        connectionString: 'postgres://postgres:lion@127.0.0.1:5432/medusa_ecom'
    });
    
    await client.connect();

    try {
        console.log("Applying strict RLS to the 'user' table...")
        
        // 1. Add tenant_id if not exists
        await client.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "tenant_id" text DEFAULT current_setting('app.current_tenant_id', true);`);
        
        // 2. We need to backfill existing users so they don't disappear completely
        // Admin user should have NULL or bypass RLS
        // For the tenants, their tenant_id is inside their metadata!
        const users = await client.query(`SELECT id, metadata FROM "user"`);
        for (const u of users.rows) {
            const tId = u.metadata?.tenant_id || null;
            if (tId) {
                await client.query(`UPDATE "user" SET tenant_id = $1 WHERE id = $2`, [tId, u.id]);
            }
        }

        // 3. Enable RLS
        await client.query(`CREATE INDEX IF NOT EXISTS "idx_user_tenant_id" ON "user" ("tenant_id");`);
        await client.query(`ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS tenant_isolation_policy ON "user";`);
        
        // 4. Apply Policy (Admin bypasses it)
        await client.query(`
            CREATE POLICY tenant_isolation_policy ON "user"
            FOR ALL
            USING (
              current_setting('app.bypass_rls', true) = 'true' 
              OR "tenant_id" = current_setting('app.current_tenant_id', true)
              OR "tenant_id" IS NULL
            )
            WITH CHECK (
              current_setting('app.bypass_rls', true) = 'true' 
              OR "tenant_id" = current_setting('app.current_tenant_id', true)
              OR "tenant_id" IS NULL
            );
        `);

        console.log("RLS Successfully applied to 'user' table!");
    } catch (e) {
        console.error(e)
    } finally {
        await client.end();
    }
}

secureUsers();
