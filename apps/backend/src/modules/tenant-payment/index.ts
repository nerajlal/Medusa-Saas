import { Module } from "@medusajs/framework/utils"
import TenantPhonePeProvider from "./service"

export const TENANT_PAYMENT_MODULE = "tenantPayment"

export default Module(TENANT_PAYMENT_MODULE, {
  service: TenantPhonePeProvider,
})
