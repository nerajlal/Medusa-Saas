import { fetchProducts, fetchProductCategories } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import AddToCart from "@/app/components/AddToCart"
import Header from "@/app/components/Header"
import { ChevronRight } from "lucide-react"

export const metadata = {
  title: "All Products | Raley's Market",
  description: "Browse our full catalog of fresh produce, dairy, bakery, and more.",
}

export default async function ProductsPage(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const selectedCategoryHandle = searchParams.category;

  const { product_categories } = await fetchProductCategories()
  
  const productParams: Record<string, string | number> = { limit: 100 }
  if (selectedCategoryHandle) {
    const selectedCat = product_categories.find((c: any) => c.handle === selectedCategoryHandle)
    if (selectedCat) {
      productParams.category_id = selectedCat.id
    }
  }
  
  const products = await fetchProducts(productParams)

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex-1 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-8 w-full">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <ChevronRight className="w-3 h-3" />
           <span className="text-foreground">
             {selectedCategoryHandle ? product_categories.find((c: any) => c.handle === selectedCategoryHandle)?.name : "All Groceries"}
           </span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-10">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              {selectedCategoryHandle 
                ? product_categories.find((c: any) => c.handle === selectedCategoryHandle)?.name 
                : "Shop All Groceries"}
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-2">
              Viewing {products.length} item{products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 rounded-[2rem] border border-gray-100">
            <div className="text-6xl mb-6 opacity-40">🛒</div>
            <h2 className="text-xl font-black text-foreground">No Items Found</h2>
            <p className="text-gray-500 mt-2 font-medium">We couldn't find any groceries in this department.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {products.map((product: any) => {
              const amount = product.variants?.[0]?.prices?.[0]?.amount || 0;
              const priceStr = (amount / 100).toFixed(2);
              const [dollars, cents] = priceStr.split(".");

              return (
                <div
                  key={product.id}
                  className="group flex flex-col relative bg-white rounded-2xl p-2 hover:instacart-shadow border border-transparent transition-all duration-300"
                >
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                     {product.variants?.[0]?.id && (
                        <AddToCart variantId={product.variants[0].id} variant="market" />
                     )}
                  </div>
                  
                  <Link href={`/products/${product.handle}`} className="relative aspect-square mb-4 block overflow-hidden rounded-xl bg-gray-50 border border-gray-100/50">
                    <Image
                      src={product.thumbnail || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000"}
                      alt={product.title || "Product Image"}
                      fill
                      unoptimized
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                    />
                  </Link>

                  <div className="flex flex-col flex-1 px-2">
                     <div className="mb-1 flex items-start text-foreground">
                        <span className="text-lg font-black">₹{dollars}</span>
                        <span className="text-[10px] font-bold leading-[1.8]">{cents}</span>
                     </div>
                     <h4 className="text-[13px] font-bold text-gray-800 leading-tight mb-1 line-clamp-2 h-8 group-hover:text-primary transition-colors">
                       {product.title}
                     </h4>
                     <p className="text-[11px] text-gray-400 font-bold mb-3 uppercase tracking-tighter">1 each</p>
                     
                     <div className="mt-auto flex items-center gap-1.5 text-[10px] font-extrabold text-primary pt-3 border-t border-gray-50">
                       <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center text-[10px]">✓</div>
                       In Stock
                     </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <footer className="bg-sidebar border-t border-border-light py-12 px-8 mt-auto w-full">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 grayscale opacity-40">
              <div className="w-8 h-8 bg-foreground rounded-lg" />
              <span className="text-xl font-black italic">Raley's</span>
            </div>
            <span className="text-xs font-bold text-gray-400">© 2026 Raley's Marketplace. All rights reserved.</span>
            <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-gray-500">
               <a href="#" className="hover:text-primary transition-colors">Privacy</a>
               <a href="#" className="hover:text-primary transition-colors">Terms</a>
               <a href="#" className="hover:text-primary transition-colors">Help</a>
            </div>
         </div>
      </footer>
    </div>
  )
}

