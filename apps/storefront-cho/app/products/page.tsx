import { fetchProducts } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import AddToCart from "@/app/components/AddToCart"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"

export const metadata = {
  title: "All Products | Choco Bliss Wholesale",
  description: "Browse our full catalog of premium wholesale chocolates, snacks, and more.",
}

export default async function ProductsPage() {
  const products = await fetchProducts({ limit: "100" })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        
        <div className="mb-10">
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <span className="text-foreground font-semibold">All Products</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight text-foreground">
            All Products
          </h1>
          <p className="text-secondary-text mt-2">
            {products.length} item{products.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-gray-100">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-black uppercase text-foreground mb-2">No Products Yet</h2>
            <p className="text-gray-400">Check back soon — new products are being added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col"
              >
                <Link href={`/products/${product.handle}`} className="aspect-square relative bg-white p-4 overflow-hidden">
                  <Image
                    src={product.thumbnail || "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000"}
                    alt={product.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="p-4 flex-1 flex flex-col justify-between border-t border-gray-50 bg-gray-50/50">
                  <Link href={`/products/${product.handle}`}>
                    <span className="text-[10px] font-bold text-secondary-text uppercase tracking-wider mb-1 block">
                      {product.title.split(" ")[0]}
                    </span>
                    <h2 className="text-sm font-bold text-foreground leading-snug mb-3 line-clamp-2 hover:text-primary transition-colors">
                      {product.title}
                    </h2>
                  </Link>

                  <div className="flex items-center justify-between mt-auto mb-3">
                    <span className="text-lg font-black text-foreground">
                      {(() => {
                        const aedPrice = product.variants?.[0]?.prices?.find(
                          (p: any) => p.currency_code === "aed"
                        )
                        return aedPrice
                          ? `AED ${(aedPrice.amount / 100).toLocaleString()}`
                          : "–"
                      })()}
                    </span>
                  </div>

                  {product.variants?.[0]?.id && (
                    <AddToCart variantId={product.variants[0].id} variant="choco" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
