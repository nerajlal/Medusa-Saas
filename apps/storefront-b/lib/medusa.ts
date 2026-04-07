// Shared Medusa storefront API client
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const SALES_CHANNEL_ID = process.env.NEXT_PUBLIC_SALES_CHANNEL_ID || ""
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || ""

export async function fetchProducts(params: Record<string, string> = {}) {
  const query = new URLSearchParams({
    sales_channel_id: SALES_CHANNEL_ID,
    ...params,
  }).toString()

  const res = await fetch(`${BACKEND_URL}/store/products?${query}`, {
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      "x-tenant-id": TENANT_ID,
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) throw new Error("Failed to fetch products")
  return res.json()
}

export async function fetchProduct(handle: string) {
  const res = await fetch(`${BACKEND_URL}/store/products?handle=${handle}`, {
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      "x-tenant-id": TENANT_ID,
    },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error("Failed to fetch product")
  const data = await res.json()
  return data.products?.[0] || null
}

export async function createCart() {
  const res = await fetch(`${BACKEND_URL}/store/carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      "x-tenant-id": TENANT_ID,
    },
    body: JSON.stringify({ sales_channel_id: SALES_CHANNEL_ID }),
  })
  return res.json()
}

export async function addLineItem(cartId: string, variantId: string, quantity: number) {
  const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      "x-tenant-id": TENANT_ID,
    },
    body: JSON.stringify({ variant_id: variantId, quantity }),
  })
  return res.json()
}
