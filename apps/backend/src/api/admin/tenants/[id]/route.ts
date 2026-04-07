import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import StoreSettingsService from "../../../../modules/store-settings/service"

// GET /admin/tenants/[id] — Get single tenant
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const storeSettingsService: StoreSettingsService = req.scope.resolve("storeSettings")
  const { id } = req.params
  const tenant = await storeSettingsService.getSettingsByTenant(id)
  if (!tenant) return res.status(404).json({ error: "Tenant not found" })
  return res.json({ tenant })
}

// PUT /admin/tenants/[id] — Update tenant settings
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  const storeSettingsService: StoreSettingsService = req.scope.resolve("storeSettings")
  const { id } = req.params
  const tenant = await storeSettingsService.getSettingsByTenant(id)
  if (!tenant) return res.status(404).json({ error: "Tenant not found" })

  const updated = await storeSettingsService.updateStoreSettings({
    id: tenant.id,
    ...(req.body as any),
    updated_at: new Date(),
  })

  return res.json({ tenant: updated })
}

// DELETE /admin/tenants/[id] — Deactivate a tenant
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const storeSettingsService: StoreSettingsService = req.scope.resolve("storeSettings")
  const { id } = req.params
  const tenant = await storeSettingsService.getSettingsByTenant(id)
  if (!tenant) return res.status(404).json({ error: "Tenant not found" })

  await storeSettingsService.updateStoreSettings({
    id: tenant.id,
    is_active: false,
    updated_at: new Date(),
  })

  return res.json({ message: `Tenant ${id} deactivated` })
}
