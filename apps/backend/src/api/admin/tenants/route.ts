import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import StoreSettingsService from "../../../modules/store-settings/service"

import { createUsersWorkflow } from "@medusajs/core-flows"
import { Modules } from "@medusajs/framework/utils"

// GET /admin/tenants — List all tenants
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const pgConnection = req.scope.resolve("__pg_connection__") as any
  const { rows } = await pgConnection.raw("SELECT * FROM store_settings WHERE deleted_at IS NULL")
  return res.json({ tenants: rows })
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
    // Store Owner credentials
    admin_email,
    admin_password,
  } = req.body as any

  if (!tenant_id || !store_name) {
    return res.status(400).json({ error: "tenant_id and store_name are required" })
  }

  // 1. Create Tenant Settings (Directly using DB connection for absolute stability)
  const pgConnection = req.scope.resolve("__pg_connection__") as any
  const storeSettingsServiceAny = req.scope.resolve("storeSettings") as any
  const tenantIdFull = `tenant_${tenant_id}`
  const encryptedKey = phonepe_api_key ? storeSettingsServiceAny.encrypt(phonepe_api_key) : null

  try {
    await pgConnection.raw(`
      INSERT INTO store_settings (id, tenant_id, store_name, theme, storefront_url, phonepe_merchant_id, phonepe_api_key_encrypted, s3_prefix, admin_email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (tenant_id) DO UPDATE SET 
        store_name = EXCLUDED.store_name,
        theme = EXCLUDED.theme,
        storefront_url = EXCLUDED.storefront_url,
        admin_email = EXCLUDED.admin_email,
        updated_at = NOW()
    `, [
      tenantIdFull || null, 
      tenant_id || null, 
      store_name || null, 
      theme || "A", 
      storefront_url || null, 
      phonepe_merchant_id || null, 
      encryptedKey || null, 
      `/${tenant_id}/` || null,
      admin_email || null
    ])
  } catch (error) {
    console.error("Failed to save store settings via RAW SQL:", error)
    return res.status(500).json({ error: "Failed to create tenant settings" })
  }

  // 2. Create Store Owner if credentials provided
  if (admin_email && admin_password) {
    const { run: createUsers } = createUsersWorkflow(req.scope)
    const remoteLink = req.scope.resolve("remoteLink") as any
    const authModuleService = req.scope.resolve(Modules.AUTH) as any
    
    try {
      // A. Create the User
      const { result: users } = await createUsers({
        input: {
          users: [
            {
              email: admin_email,
              first_name: store_name,
              last_name: "Owner",
              metadata: {
                tenant_id: tenant_id,
                role: "tenant_admin"
              }
            }
          ]
        }
      })
      
      const userId = users[0].id

      // B. Create Auth Identity (Email/Pass)
      const authIdentity = await authModuleService.createAuthIdentities({
        provider: "emailpass",
        entity_id: admin_email,
        scope: "admin",
        provider_metadata: {
          password: admin_password
        },
        app_metadata: {
          tenant_id: tenant_id
        }
      })

      // C. Link User to Auth Identity (using standard Medusa v2 keys)
      await remoteLink.create([
        {
          [Modules.USER]: {
            user_id: userId,
          },
          [Modules.AUTH]: {
             auth_identity_id: authIdentity.id,
          },
        },
      ])

    } catch (error) {
       console.error("Failed to create store owner:", error)
    }
  }

  return res.status(201).json({ 
    tenant: {
      id: tenantIdFull,
      tenant_id,
      store_name
    }
  })
}

export const AUTHENTICATE = false
