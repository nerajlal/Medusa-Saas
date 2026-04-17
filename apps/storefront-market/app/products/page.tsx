import { fetchProducts, fetchProductCategories } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import AddToCart from "@/app/components/AddToCart"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"

export const metadata = {
  title: "All Products | Chocolayt Wholesale",
  description: "Browse our full catalog of premium wholesale chocolates, snacks, and more.",
}

export default async function ProductsPage(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const selectedCategoryHandle = searchParams.category;

  const { product_categories } = await fetchProductCategories()
  
  // Filter products by category if one is selected
  const productParams: Record<string, string | number> = { limit: 100 }
  if (selectedCategoryHandle) {
    const selectedCat = product_categories.find((c: any) => c.handle === selectedCategoryHandle)
    if (selectedCat) {
      productParams.category_id = selectedCat.id
    }
  }
  
  const products = await fetchProducts(productParams)

  // Map emojis to categories for the circular nav
  const categoryIconMap: Record<string, string> = {
    "fresh-produce": "🍎",
    "pantry": "🍞",
    "chocolates": "🍫",
    "jellies": "🍮",
    "candies": "🍬",
    "marshmallow": "🍥",
    "wafers-cake": "🍰",
    "biscuits": "🍪",
    "bubble-gum": "🎈"
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Circular Category Slider - Sticky context removed for Products Page */}
      <section className="py-8 border-b border-gray-100 bg-white">
         <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex overflow-x-auto py-2 gap-6 md:gap-10 scrollbar-hide">
               <Link href="/products" className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-sm ${!selectedCategoryHandle ? 'bg-primary border-4 border-yellow-200 scale-110 shadow-lg shadow-yellow-200' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                     📦
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${!selectedCategoryHandle ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}>All</span>
               </Link>
               {product_categories.map((cat: any) => (
                 <Link key={cat.id} href={`/products?category=${cat.handle}`} className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-sm ${selectedCategoryHandle === cat.handle ? 'bg-primary border-4 border-yellow-200 scale-110 shadow-lg shadow-yellow-200' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                       {categoryIconMap[cat.handle] || "🛍️"}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedCategoryHandle === cat.handle ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}>{cat.name}</span>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-12">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase italic">
              {selectedCategoryHandle 
                ? product_categories.find((c: any) => c.handle === selectedCategoryHandle)?.name 
                : "Full Collection"}
            </h1>
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mt-2">
              Showing {products.length} wholesale ready item{products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-40 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-6 opacity-30">📦</div>
            <h2 className="text-xl font-black uppercase text-gray-400">Inventory Sync in Progress</h2>
            <p className="text-gray-400 mt-2 font-medium">This category is currently being restocked. Check back in a few hours!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-yellow-100/50 transition-all duration-300 flex flex-col h-full overflow-hidden"
              >
                {/* Title Top - Chocolayt Pattern */}
                <div className="p-5 pb-0">
                  <h4 className="text-[13px] font-black text-gray-800 leading-tight line-clamp-2 h-8 group-hover:text-primary transition-colors uppercase">
                    {product.title}
                  </h4>
                </div>

                <Link href={`/products/${product.handle}`} className="flex-1 relative aspect-square flex items-center justify-center p-8">
                  <Image
                    src={product.thumbnail || "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000"}
                    alt={product.title || "Product Image"}
                    fill
                    unoptimized
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>

                <div className="p-5 pt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Price </span>
                    <span className="text-lg font-black text-black">
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
                    <div className="group-hover:scale-[1.02] transition-transform">
                      <AddToCart variantId={product.variants[0].id} variant="choco" />
                    </div>
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
