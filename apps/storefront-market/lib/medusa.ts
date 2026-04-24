// Shared Medusa storefront API client
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const SALES_CHANNEL_ID = process.env.NEXT_PUBLIC_SALES_CHANNEL_ID || ""
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || ""
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
const REGION_ID = process.env.NEXT_PUBLIC_REGION_ID || ""

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-publishable-api-key": PUBLISHABLE_KEY,
  "x-tenant-id": TENANT_ID,
})

export async function fetchProducts(params: Record<string, string> = {}) {
  try {
    const queryItems = {
      sales_channel_id: SALES_CHANNEL_ID,
      fields: "*categories,*variants.prices",
      ...params,
    }
    const query = new URLSearchParams(queryItems as any).toString()

    const res = await fetch(`${BACKEND_URL}/store/products?${query}`, {
      headers: getHeaders(),
      cache: 'no-store'
    })

    if (!res.ok) throw new Error("Failed to fetch products")
    const data = await res.json()
    return data.products || []
  } catch (e) {
    console.error("Fetch products failed:", e)
    return []
  }
}

export async function fetchProduct(handle: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/store/products?handle=${handle}&fields=*variants.prices`, {
      headers: getHeaders(),
      cache: 'no-store'
    })
    if (!res.ok) throw new Error("Failed to fetch product")
    const data = await res.json()
    return data.products?.[0] || null
  } catch (e) {
    console.error("Fetch product failed:", e)
    return null
  }
}

export async function fetchProductCategories() {
  try {
    const res = await fetch(`${BACKEND_URL}/store/product-categories`, {
      headers: getHeaders(),
      cache: 'no-store'
    })
    if (!res.ok) return { product_categories: [] }
    return res.json()
  } catch (e) {
    console.error("Fetch categories failed:", e)
    return { product_categories: [] }
  }
}

export async function createCart() {
  const res = await fetch(`${BACKEND_URL}/store/carts`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ 
      sales_channel_id: SALES_CHANNEL_ID,
      region_id: REGION_ID 
    }),
  })
  if (!res.ok) {
     const error = await res.json()
     console.error("Cart creation failed:", error)
     throw new Error("Failed to create cart")
  }
  return res.json()
}

export async function addLineItem(cartId: string, variantId: string, quantity: number) {
  const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ variant_id: variantId, quantity }),
  })
  if (!res.ok) {
    const error = await res.json()
    console.error("Add line item failed:", error)
    throw new Error(error.message || "Failed to add line item")
  }
  return res.json()
}

export async function updateLineItem(cartId: string, itemId: string, quantity: number) {
  const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items/${itemId}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ quantity }),
  })
  if (!res.ok) throw new Error("Failed to update line item")
  return res.json()
}

export async function deleteLineItem(cartId: string, itemId: string) {
  const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items/${itemId}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error("Failed to delete line item")
  return res.json()
}

export async function fetchCart(cartId: string) {
  const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
    headers: getHeaders(),
    cache: 'no-store'
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.cart || null
}

export async function fetchCollections() {
  const res = await fetch(`${BACKEND_URL}/store/collections`, {
    headers: getHeaders(),
    cache: 'no-store'
  })
  if (!res.ok) return { collections: [] }
  return res.json()
}

export async function fetchCollectionByHandle(handle: string) {
  const res = await fetch(`${BACKEND_URL}/store/collections?handle=${handle}`, {
    headers: getHeaders(),
    cache: 'no-store'
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.collections?.[0] || null
}

export async function updateCart(cartId: string, data: any) {
  const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update cart")
  return res.json()
}

export async function fetchShippingOptions(cartId: string) {
  const res = await fetch(`${BACKEND_URL}/store/shipping-options?cart_id=${cartId}`, {
    headers: getHeaders(),
    cache: 'no-store'
  })
  if (!res.ok) return { shipping_options: [] }
  return res.json()
}

export async function addShippingMethod(cartId: string, optionId: string) {
  const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/shipping-methods`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ option_id: optionId }),
  })
  if (!res.ok) throw new Error("Failed to add shipping method")
  return res.json()
}

export async function initiatePaymentSession(cartId: string) {
  const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/payment-sessions`, {
    method: "POST",
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error("Failed to initiate payment session")
  return res.json()
}

export async function completeCart(cartId: string) {
  const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/complete`, {
    method: "POST",
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error("Failed to complete cart")
  return res.json()
}
