const BACKEND_URL = "http://localhost:9000"
const PUBLISHABLE_KEY = "pk_651b4c2c09454729b198e480b85c934d479d32cdf5237d5bc06d113a83c906e9"
const TENANT_ID = "apple-premium"

async function checkProducts() {
  const res = await fetch(`${BACKEND_URL}/store/products`, {
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_KEY,
      "x-tenant-id": TENANT_ID,
    }
  })
  const data = await res.json()
  console.log(JSON.stringify(data.products.map(p => ({ id: p.id, title: p.title, handle: p.handle })), null, 2))
}

checkProducts()
