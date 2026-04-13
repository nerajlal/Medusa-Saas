// Shared Medusa storefront API client
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const SALES_CHANNEL_ID = process.env.NEXT_PUBLIC_SALES_CHANNEL_ID || ""
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || ""
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function fetchProducts(params: Record<string, string> = {}) {
  try {
    const query = new URLSearchParams({
      fields: "*variants.prices",
      ...params,
    }).toString()

    const res = await fetch(`${BACKEND_URL}/store/products?${query}`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_KEY,
        "x-tenant-id": TENANT_ID,
      },
      next: { revalidate: 60 },
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
      headers: {
        "x-publishable-api-key": PUBLISHABLE_KEY,
        "x-tenant-id": TENANT_ID,
      },
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error("Failed to fetch product")
    const data = await res.json()
    return data.products?.[0] || null
  } catch (e) {
    console.error("Fetch product failed:", e)
    return null
  }
}


export async function createCart() {
  const res = await fetch(`${BACKEND_URL}/store/carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_KEY,
      "x-tenant-id": TENANT_ID,
    },
    body: JSON.stringify({ sales_channel_id: SALES_CHANNEL_ID }),
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
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_KEY,
      "x-tenant-id": TENANT_ID,
    },
    body: JSON.stringify({ variant_id: variantId, quantity }),
  })
  if (!res.ok) {
    const error = await res.json()
    console.error("Add line item failed:", error)
    throw new Error("Failed to add line item")
  }
  return res.json()
}

export async function fetchCart(cartId: string) {
  const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
    headers: {
      "x-publishable-api-key": PUBLISHABLE_KEY,
      "x-tenant-id": TENANT_ID,
    },
  })
  if (!res.ok) return null
  return res.json()
}

export async function fetchCollections() {
  const res = await fetch(`${BACKEND_URL}/store/collections`, {
    headers: {
      "x-publishable-api-key": PUBLISHABLE_KEY,
      "x-tenant-id": TENANT_ID,
    },
  })
  if (!res.ok) return { collections: [] }
  return res.json()
}

export async function fetchCollectionByHandle(handle: string) {
  const res = await fetch(`${BACKEND_URL}/store/collections?handle=${handle}`, {
    headers: {
      "x-publishable-api-key": PUBLISHABLE_KEY,
      "x-tenant-id": TENANT_ID,
    },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.collections?.[0] || null
}

export async function deleteLineItem(cartId: string, itemId: string) {
  const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items/${itemId}`, {
    method: "DELETE",
    headers: {
      "x-publishable-api-key": PUBLISHABLE_KEY,
      "x-tenant-id": TENANT_ID,
    },
  })
  if (!res.ok) throw new Error("Failed to delete line item")
  return res.json()
}

export async function updateLineItem(cartId: string, itemId: string, quantity: number) {
  const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items/${itemId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_KEY,
      "x-tenant-id": TENANT_ID,
    },
    body: JSON.stringify({ quantity }),
  })
  if (!res.ok) throw new Error("Failed to update line item")
  return res.json()
}
