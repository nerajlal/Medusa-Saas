import { model } from "@medusajs/framework/utils"

// Stores encrypted payment credentials and configuration for each tenant
export const StoreSettings = model.define("store_settings", {
  id: model.id().primaryKey(),
  tenant_id: model.text().unique(),
  store_name: model.text(),
  // PhonePe / Payment credentials - stored encrypted
  phonepe_merchant_id: model.text().nullable(),
  phonepe_api_key_encrypted: model.text().nullable(),
  phonepe_env: model.enum(["sandbox", "production"]).default("sandbox"),
  // Sales Channel this tenant is mapped to
  sales_channel_id: model.text().nullable(),
  // Theme assignment: A, B, or C
  theme: model.enum(["A", "B", "C"]).default("A"),
  // Storefront domain for CORS
  storefront_url: model.text().nullable(),
  // S3 bucket prefix (auto-derived as /tenant_id/)
  s3_prefix: model.text().nullable(),
  is_active: model.boolean().default(true),
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
})
