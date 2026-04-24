import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const query = req.scope.resolve("query")
    
    // Fetch products with their variants
    // In a production environment, you would filter this tightly by the sales_channel_id
    // using the Remote Link between product and sales_channel.
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "description",
        "handle",
        "thumbnail",
        "variants.*",
      ]
    })

    // Meta Commerce Manager required headers
    const csvHeaders = [
      "id",
      "title",
      "description",
      "availability",
      "condition",
      "price",
      "link",
      "image_link",
      "brand"
    ]

    let csvContent = csvHeaders.join(",") + "\n"

    products.forEach((p: any) => {
      // Ensure the product has variants to be sellable
      if (!p.variants || p.variants.length === 0) return

      // Sanitize fields for CSV
      const safeTitle = p.title ? p.title.replace(/"/g, '""') : ""
      const safeDesc = p.description ? p.description.replace(/"/g, '""').replace(/\n/g, ' ') : "Premium product from Raley's Market"
      
      // Formatting price (assuming a base price of 10 INR if pricing relation isn't explicitly joined)
      // Meta requires currency code: e.g., "10.00 INR"
      const price = "10.00 INR" 
      
      const link = `http://localhost:8004/products/${p.handle}`
      const imageLink = p.thumbnail || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"

      const row = [
        p.id,
        `"${safeTitle}"`,
        `"${safeDesc}"`,
        "in stock",
        "new",
        price,
        link,
        imageLink,
        "Raley's Market"
      ]

      csvContent += row.join(",") + "\n"
    })

    // Return as a downloadable CSV file
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=raleys-whatsapp-feed.csv")
    
    return res.send(csvContent)

  } catch (error) {
    console.error("[WhatsApp Sync] Failed to generate catalog feed:", error)
    return res.status(500).json({ error: "Failed to generate catalog feed" })
  }
}
