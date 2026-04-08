// Shared Medusa storefront API client
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const SALES_CHANNEL_ID = process.env.NEXT_PUBLIC_SALES_CHANNEL_ID || ""
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || ""

export async function fetchProducts(params: Record<string, string> = {}) {
  try {
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
  } catch (e) {
    console.error("Backend fetch failed, returning mock data...")
    return {
      products: [
        {
          id: "prod_1",
          title: "Premium Essential Tee",
          handle: "premium-essential-tee",
          thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
          variants: [{ id: "var_1", prices: [{ amount: 2500, currency_code: "usd" }] }]
        },
        {
          id: "prod_2",
          title: "Minimalist Watch",
          handle: "minimalist-watch",
          thumbnail: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
          variants: [{ id: "var_2", prices: [{ amount: 4500, currency_code: "usd" }] }]
        },
        {
          id: "prod_3",
          title: "Organic Cotton Tote",
          handle: "organic-tote",
          thumbnail: "https://images.unsplash.com/photo-1544816153-199d88-f06294e1?auto=format&fit=crop&w=800&q=80",
          variants: [{ id: "var_3", prices: [{ amount: 1500, currency_code: "usd" }] }]
        }
      ]
    }
  }
}

export async function fetchProduct(handle: string) {
  try {
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
  } catch (e) {
    return {
      id: "prod_1",
      title: "Premium Essential Tee",
      handle: "premium-essential-tee",
      description: "A high-quality minimalist tee designed for everyday comfort.",
      thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
      variants: [{ id: "var_1", title: "Standard", prices: [{ amount: 2500, currency_code: "usd" }] }]
    }
  }
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
