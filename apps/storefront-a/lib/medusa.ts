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
    console.warn("Backend fetch failed, returning mock data...")
    return {
      products: [
        {
          id: "prod_1",
          title: "Ceramic Minimalist Vase",
          handle: "ceramic-vase",
          thumbnail: "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=800&q=80",
          description: "Hand-crafted ceramic vase with a matte finish. Perfect for minimalist interiors.",
          variants: [{ prices: [{ amount: 4500, currency_code: "inr" }] }]
        },
        {
          id: "prod_2",
          title: "Matte Black Desk Lamp",
          handle: "desk-lamp",
          thumbnail: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80",
          description: "Adjustable desk lamp with a sleek matte black finish and warm LED light.",
          variants: [{ prices: [{ amount: 7200, currency_code: "inr" }] }]
        },
        {
          id: "prod_3",
          title: "Wool Texture Throw",
          handle: "wool-throw",
          thumbnail: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80",
          description: "Soft wool throw blanket with a rich texture, ideal for cozy evenings.",
          variants: [{ prices: [{ amount: 3800, currency_code: "inr" }] }]
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

export async function fetchCollections() {
  try {
    const res = await fetch(`${BACKEND_URL}/store/collections`, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        "x-tenant-id": TENANT_ID,
      },
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error("Failed to fetch collections")
    return res.json()
  } catch (e) {
    return {
      collections: [
        { id: "col_1", title: "Summer Essentials", handle: "summer-essentials", description: "Stay cool with our latest summer drops." },
        { id: "col_2", title: "Winter Archive", handle: "winter-archive", description: "Timeless pieces for the cold season." },
        { id: "col_3", title: "New Arrivals", handle: "new-arrivals", description: "The freshest inventory just for you." }
      ]
    }
  }
}

export async function fetchCollectionByHandle(handle: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/store/collections?handle=${handle}`, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        "x-tenant-id": TENANT_ID,
      },
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error("Failed to fetch collection")
    const data = await res.json()
    return data.collections?.[0] || null
  } catch (e) {
    const collections: any = {
      "summer-essentials": { id: "col_1", title: "Summer Essentials", handle: "summer-essentials", metadata: { theme: "light" } },
      "winter-archive": { id: "col_2", title: "Winter Archive", handle: "winter-archive", metadata: { theme: "cool" } },
      "new-arrivals": { id: "col_3", title: "New Arrivals", handle: "new-arrivals", metadata: { theme: "vibrant" } }
    }
    return collections[handle] || collections["new-arrivals"]
  }
}

