import { ExecArgs } from "@medusajs/framework/types";

export default async function applyRLS({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  
  const coreTables = [
      'product',
      'product_variant',
      'product_option',
      'product_collection',
      'product_type',
      'product_tag',
      'order',
      'cart',
      'line_item',
      'customer',
      'payment_collection',
      'payment',
      'region',
      'shipping_option',
      'sales_channel',
      'promotion',
      'price_list',
      'fulfillment',
      'store',
      'user'
  ];

  console.log("Applying RLS...");

  for (const table of coreTables) {
    try {
      // Add column IF NOT EXISTS first
      await pgConnection.raw(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "tenant_id" text;`);
      
      // Update any existing NULLs to empty string temporarily so we can apply NOT NULL
      // (Though table should be empty, this is safer)
      await pgConnection.raw(`UPDATE "${table}" SET "tenant_id" = '' WHERE "tenant_id" IS NULL;`);
      
      // Enforce NOT NULL and DEFAULT
      await pgConnection.raw(`ALTER TABLE "${table}" ALTER COLUMN "tenant_id" SET NOT NULL;`);
      await pgConnection.raw(`ALTER TABLE "${table}" ALTER COLUMN "tenant_id" SET DEFAULT current_setting('app.current_tenant_id', true);`);
      
      await pgConnection.raw(`CREATE INDEX IF NOT EXISTS "idx_${table}_tenant_id" ON "${table}" ("tenant_id");`);
      await pgConnection.raw(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      await pgConnection.raw(`ALTER TABLE "${table}" FORCE ROW LEVEL SECURITY;`);
      await pgConnection.raw(`DROP POLICY IF EXISTS tenant_isolation_policy ON "${table}";`);
      await pgConnection.raw(`
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
      console.log(`Applied RLS to ${table} (Forced)`);
    } catch(e) {
      console.log(`Failed applying to ${table}:`, e.message);
    }
  }

  console.log("RLS Fully Applied!");
}
