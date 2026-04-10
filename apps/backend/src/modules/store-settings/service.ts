import { MedusaService } from "@medusajs/framework/utils"
import { StoreSettings } from "./model"
import crypto from "crypto"

type CreateStoreSettingsDTO = {
  tenant_id: string
  store_name: string
  theme?: "A" | "B" | "C"
  sales_channel_id?: string
  storefront_url?: string
  phonepe_merchant_id?: string
  phonepe_api_key?: string // plaintext — we will encrypt
  phonepe_env?: "sandbox" | "production"
}

class StoreSettingsService extends MedusaService({
  StoreSettings,
}) {
  private encryptionKey: string

  constructor(container: any) {
    super(container)
    // Encryption key from env - must be 32 chars (AES-256)
    this.encryptionKey =
      process.env.ENCRYPTION_KEY || "00000000000000000000000000000000"
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(this.encryptionKey, "utf8"),
      iv
    )
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")
    return `${iv.toString("hex")}:${encrypted}`
  }

  private decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(":")
    const iv = Buffer.from(ivHex, "hex")
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(this.encryptionKey, "utf8"),
      iv
    )
    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  }

  async createStoreTenantSettings(data: CreateStoreSettingsDTO, sharedContext?: any) {
    const { phonepe_api_key, ...rest } = data
    
    // We use the base create method from MedusaService
    return await (this as any).createStoreSettings({
      ...rest,
      s3_prefix: `/${data.tenant_id}/`,
      phonepe_api_key_encrypted: phonepe_api_key
        ? this.encrypt(phonepe_api_key)
        : undefined,
    }, sharedContext)
  }

  async getDecryptedPhonePeCredentials(tenant_id: string) {
    const [settings] = await this.listStoreSettings({ tenant_id })
    if (!settings) return null

    return {
      merchant_id: settings.phonepe_merchant_id,
      api_key: settings.phonepe_api_key_encrypted
        ? this.decrypt(settings.phonepe_api_key_encrypted)
        : null,
      env: settings.phonepe_env,
    }
  }

  async getSettingsByTenant(tenant_id: string) {
    const [settings] = await this.listStoreSettings({ tenant_id })
    return settings || null
  }

  async listAllTenants() {
    return this.listStoreSettings({})
  }
}

export default StoreSettingsService
