import { Migration } from '@mikro-orm/migrations';

export class TenantRLSMigration extends Migration {
  async up(): Promise<void> {
    // 1. Add tenant_id to core tables
    const coreTables = ['product', 'customer', 'order', 'cart', 'payment_collection'];
    
    for (const table of coreTables) {
      // Add column
      this.addSql(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "tenant_id" text;`);
      
      // Index for fast tenant lookups
      this.addSql(`CREATE INDEX IF NOT EXISTS "idx_${table}_tenant_id" ON "${table}" ("tenant_id");`);

      // 2. Enable Row-Level Security
      this.addSql(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);

      // 3. Drop existing policy if it exists to be idempotent
      this.addSql(`DROP POLICY IF EXISTS tenant_isolation_policy ON "${table}";`);

      // 4. Create RLS Policy
      // We enforce that the tenant_id must match the current local setting in Postgres
      // We also check if we are in a 'bypass_rls' context (for Master Admin/internal jobs)
      this.addSql(`
        CREATE POLICY tenant_isolation_policy ON "${table}"
        FOR ALL
        USING (
          current_setting('app.bypass_rls', true) = 'true' 
          OR "tenant_id" = current_setting('app.current_tenant_id', true)
        )
        WITH CHECK (
          current_setting('app.bypass_rls', true) = 'true' 
          OR "tenant_id" = current_setting('app.current_tenant_id', true)
        );
      `);
    }
  }

  async down(): Promise<void> {
    const coreTables = ['product', 'customer', 'order', 'cart', 'payment_collection'];
    
    for (const table of coreTables) {
      this.addSql(`DROP POLICY IF EXISTS tenant_isolation_policy ON "${table}";`);
      this.addSql(`ALTER TABLE "${table}" DISABLE ROW LEVEL SECURITY;`);
      this.addSql(`DROP INDEX IF EXISTS "idx_${table}_tenant_id";`);
      this.addSql(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "tenant_id";`);
    }
  }
}
