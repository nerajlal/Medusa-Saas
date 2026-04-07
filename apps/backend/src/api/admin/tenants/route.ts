import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import StoreSettingsService from "../../../modules/store-settings/service"

// GET /admin/tenants — List all tenants
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const storeSettingsService: StoreSettingsService = req.scope.resolve("storeSettings")
  const tenants = await storeSettingsService.listAllTenants()
  return res.json({ tenants })
}

// POST /admin/tenants — Create a new tenant
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const storeSettingsService: StoreSettingsService = req.scope.resolve("storeSettings")
  const {
    tenant_id,
    store_name,
    theme,
    sales_channel_id,
    storefront_url,
    phonepe_merchant_id,
    phonepe_api_key,
    phonepe_env,
  } = req.body as any

  if (!tenant_id || !store_name) {
    return res.status(400).json({ error: "tenant_id and store_name are required" })
  }

  const tenant = await storeSettingsService.createStoreTenantSettings({
    tenant_id,
    store_name,
    theme: theme || "A",
    sales_channel_id,
    storefront_url,
    phonepe_merchant_id,
    phonepe_api_key,
    phonepe_env: phonepe_env || "sandbox",
  })

  return res.status(201).json({ tenant })
}
