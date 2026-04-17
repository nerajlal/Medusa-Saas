import fs from "fs"

async function testFetch() {
  console.log("Fetching from backend...")
  try {
    const res = await fetch("http://localhost:9000/store/products?limit=5", {
      headers: {
        "x-tenant-id": "raleys-market",
        "x-publishable-api-key": "pk_651b4c2c09454729b198e480b85c934d479d32cdf5237d5bc06d113a83c906e9"
      }
    })
    
    if (!res.ok) {
      console.error("HTTP Error:", res.status, await res.text())
      return
    }
    
    const data = await res.json()
    console.log(`Successfully fetched ${data.products?.length} products.`)
    console.log("Total Count:", data.count)
    console.log("Sample Titles:", data.products?.map((p: any) => p.title).join(", "))
    console.log("Categories for first product:", data.products?.[0]?.categories?.map((c: any) => c.name).join(", "))
  } catch(e: any) {
    console.error("Fetch failed:", e.message)
  }
}

testFetch()
