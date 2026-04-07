import { AsyncLocalStorage } from "async_hooks"

// Create a global storage for tenant context
export const tenantContextStorage = new AsyncLocalStorage<string>()

export function getTenantId() {
  return tenantContextStorage.getStore()
}
