import {
  AbstractPaymentProvider,
} from "@medusajs/framework/utils"
import { 
  AuthorizePaymentInput, 
  AuthorizePaymentOutput, 
  CapturePaymentInput, 
  CapturePaymentOutput, 
  InitiatePaymentInput, 
  InitiatePaymentOutput, 
  PaymentProviderError, 
  ProviderWebhookPayload, 
  RefundPaymentInput, 
  RefundPaymentOutput, 
  WebhookActionResult 
} from "@medusajs/types"
import axios from "axios"
import crypto from "crypto"
import StoreSettingsService from "../store-settings/service"

type PhonePeOptions = {
  storeSettingsService: StoreSettingsService
}

// PhonePe Payment Provider with dynamic per-tenant credential resolution
class TenantPhonePeProvider extends AbstractPaymentProvider<PhonePeOptions> {
  static identifier = "tenant-phonepe"
  private storeSettingsService: StoreSettingsService

  constructor(container: any, options: PhonePeOptions) {
    super(container, options)
    this.storeSettingsService = container["storeSettings"]
  }

  private getPhonePeBaseUrl(env: string) {
    return env === "production"
      ? "https://api.phonepe.com/apis/hermes"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1"
  }

  private generatePhonePeChecksum(payload: string, apiKey: string, endpoint: string) {
    const base64Payload = Buffer.from(payload).toString("base64")
    const stringToHash = base64Payload + endpoint + apiKey
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex")
    return `${sha256}###1`
  }

  // Resolve credentials from StoreSettings using tenant_id
  private async getCredentials(tenantId: string) {
    if (!tenantId) {
      throw new Error("No tenant_id found in payment context")
    }
    const creds = await this.storeSettingsService.getDecryptedPhonePeCredentials(tenantId)
    if (!creds || !creds.merchant_id || !creds.api_key) {
      throw new Error(`PhonePe credentials not configured for tenant: ${tenantId}`)
    }
    return creds
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<PaymentProviderError | InitiatePaymentOutput> {
    try {
      const tenantId = (input.metadata?.tenant_id as string) || "default"
      const creds = await this.getCredentials(tenantId)
      const baseUrl = this.getPhonePeBaseUrl(creds.env!)
      const merchantTransactionId = `TXN_${tenantId}_${Date.now()}`

      const paymentData = {
        merchantId: creds.merchant_id,
        merchantTransactionId,
        merchantUserId: input.customer?.id || "ANON",
        amount: Math.round(input.amount * 100), // paise
        redirectUrl: `${input.metadata?.storefront_url || ""}/checkout/payment-result?session_id=${merchantTransactionId}`,
        redirectMode: "REDIRECT",
        callbackUrl: `${process.env.BACKEND_URL}/store/phonepe/webhook?tenant_id=${tenantId}`,
        mobileNumber: (input as any).billing_address?.phone,
        paymentInstrument: { type: "PAY_PAGE" },
      }

      const payload = JSON.stringify(paymentData)
      const base64Payload = Buffer.from(payload).toString("base64")
      const checksum = this.generatePhonePeChecksum(payload, creds.api_key!, "/pg/v1/pay")

      const response = await axios.post(
        `${baseUrl}/pg/v1/pay`,
        { request: base64Payload },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
            "X-MERCHANT-ID": creds.merchant_id,
          },
        }
      )

      const redirectUrl = response.data?.data?.instrumentResponse?.redirectInfo?.url

      return {
        data: {
          merchantTransactionId,
          redirectUrl,
          status: "PENDING",
          tenant_id: tenantId,
        },
      }
    } catch (e: any) {
      return { error: e.message, code: "PHONEPE_INIT_FAILED" }
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<PaymentProviderError | AuthorizePaymentOutput> {
    try {
      const tenantId = (input.data?.tenant_id as string) || "default"
      const creds = await this.getCredentials(tenantId)
      const { merchantTransactionId } = input.data
      const baseUrl = this.getPhonePeBaseUrl(creds.env!)
      const endpoint = `/pg/v1/status/${creds.merchant_id}/${merchantTransactionId}`
      const checksum = this.generatePhonePeChecksum("", creds.api_key!, endpoint)

      const response = await axios.get(`${baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": creds.merchant_id,
        },
      })

      const status = response.data?.data?.state
      return {
        status: status === "COMPLETED" ? "authorized" : "pending",
        data: { ...input.data, phonePeStatus: status },
      }
    } catch (e: any) {
      return { error: e.message, code: "PHONEPE_AUTH_FAILED" }
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<PaymentProviderError | CapturePaymentOutput> {
    return { data: { ...input.data, captured: true } }
  }

  async refundPayment(
    input: RefundPaymentInput
  ): Promise<PaymentProviderError | RefundPaymentOutput> {
    return { data: { ...input.data, refunded: input.amount } }
  }

  async cancelPayment(
    paymentSessionData: Record<string, any>
  ): Promise<PaymentProviderError | Record<string, any>> {
    return { ...paymentSessionData, cancelled: true }
  }

  async deletePayment(
    paymentSessionData: Record<string, any>
  ): Promise<PaymentProviderError | Record<string, any>> {
    return paymentSessionData
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, any>
  ): Promise<{ status: string }> {
    const status = paymentSessionData.phonePeStatus
    if (status === "COMPLETED") return { status: "captured" }
    if (status === "FAILED") return { status: "canceled" }
    return { status: "pending" }
  }

  async retrievePayment(
    paymentSessionData: Record<string, any>
  ): Promise<PaymentProviderError | Record<string, any>> {
    return paymentSessionData
  }

  async updatePayment(
    input: InitiatePaymentInput
  ): Promise<PaymentProviderError | InitiatePaymentOutput> {
    return { data: input.metadata || {} }
  }

  async getWebhookActionAndData(
    webhookData: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    return {
      action: "authorized",
      data: {
        session_id: (webhookData.data as any)?.merchantTransactionId,
        amount: (webhookData.data as any)?.amount / 100,
      },
    }
  }
}

export default TenantPhonePeProvider
