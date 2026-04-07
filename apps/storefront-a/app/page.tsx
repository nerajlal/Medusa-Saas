import { fetchProducts } from "@/lib/medusa"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  let products: any[] = []
  try {
    const data = await fetchProducts({ limit: "12" })
    products = data.products || []
  } catch (_) {
    products = []
  }

  const placeholders = ["🧪", "🎒", "💡", "📦", "🎨", "🌿", "✨", "🌊", "🔮", "🎯", "🧩", "💎"]

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h1>
          Less, but <span>better.</span>
        </h1>
        <p>
          A thoughtfully curated selection of products — each chosen for design, quality, and purpose.
        </p>
        <a href="#products" className="btn">Explore Collection</a>
      </section>

      {/* Products */}
      <div id="products">
        <div className="section-title">
          <h2>Collection</h2>
          <p>New Arrivals</p>
        </div>

        <div className="product-grid">
          {products.length > 0
            ? products.map((p: any, i: number) => {
                const variant = p.variants?.[0]
                const price = variant?.prices?.[0]
                const amount = price
                  ? new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: price.currency_code?.toUpperCase() || "INR",
                    }).format(price.amount / 100)
                  : "—"

                return (
                  <div className="product-card" key={p.id}>
                    <div className="product-image">
                      {p.thumbnail
                        ? <img src={p.thumbnail} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : placeholders[i % placeholders.length]}
                    </div>
                    <div className="product-info">
                      <h3>{p.title}</h3>
                      <div className="price">{amount}</div>
                      <button className="add-to-cart">Add to Cart</button>
                    </div>
                  </div>
                )
              })
            : placeholders.map((emoji, i) => (
                <div className="product-card" key={i}>
                  <div className="product-image">{emoji}</div>
                  <div className="product-info">
                    <div className="skeleton" style={{ height: "16px", width: "70%", marginBottom: "8px" }} />
                    <div className="skeleton" style={{ height: "13px", width: "40%", marginBottom: "14px" }} />
                    <div className="add-to-cart" style={{ background: "#e5e7eb", color: "transparent" }}>—</div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  )
}
