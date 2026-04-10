import { Migration } from '@mikro-orm/migrations';

export class Migration20260410000000_InitialStoreSettings extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "store_settings" (
        "id" text NOT NULL,
        "tenant_id" text NOT NULL,
        "store_name" text NOT NULL,
        "phonepe_merchant_id" text NULL,
        "phonepe_api_key_encrypted" text NULL,
        "phonepe_env" text DEFAULT 'sandbox',
        "sales_channel_id" text NULL,
        "theme" text DEFAULT 'A',
        "storefront_url" text NULL,
        "s3_prefix" text NULL,
        "is_active" boolean DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "store_settings_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "store_settings_tenant_id_unique" UNIQUE ("tenant_id")
      );
    `);
    
    this.addSql(`CREATE INDEX IF NOT EXISTS "idx_store_settings_tenant_id" ON "store_settings" ("tenant_id");`);
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "store_settings";`);
  }
}
