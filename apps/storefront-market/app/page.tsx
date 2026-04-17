import { fetchProducts, fetchProductCategories } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import AddToCart from "./components/AddToCart"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import { ChevronRight, Clock, Star } from "lucide-react"

function Price({ amount }: { amount: number }) {
  const price = (amount / 100).toFixed(2)
  const [dollars, cents] = price.split(".")
  return (
    <div className="flex items-start text-foreground">
      <span className="text-xl font-black">₹{dollars}</span>
      <span className="price-superscript">{cents}</span>
    </div>
  )
}

export default async function Home(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const selectedCategoryHandle = searchParams.category;

  const { product_categories } = await fetchProductCategories()
  
  // Fetch all products for grouped layout or filtered layout
  const allProducts = await fetchProducts()
  
  const filteredProducts = selectedCategoryHandle 
    ? allProducts.filter((p: any) => p.categories?.some((c: any) => c.handle === selectedCategoryHandle))
    : allProducts

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1 flex w-full">
        <Sidebar categories={product_categories} selectedCategory={selectedCategoryHandle} />
        
        <main className="flex-1 min-w-0 p-4 md:p-8 space-y-12">
          {/* Hero Banner - Instacart Style */}
          {!selectedCategoryHandle && (
            <div className="bg-[#EBF7F2] rounded-2xl p-8 md:p-12 relative overflow-hidden flex items-center border border-primary/10">
              <div className="space-y-4 relative z-10 max-w-lg">
                 <div className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-current" />
                    Special Offer
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black leading-[0.95] tracking-tight text-secondary">
                    Fresh from <br/><span className="text-primary italic">Raley's</span> to you.
                 </h2>
                 <p className="text-foreground/70 font-bold text-lg leading-tight">Same-day delivery in as little as 1 hour.</p>
                 <div className="flex gap-3 pt-2">
                   <button className="bg-primary text-white px-8 py-3.5 rounded-full font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all">Shop Now</button>
                   <div className="flex items-center gap-2 text-primary font-bold text-sm bg-white px-4 rounded-full border border-primary/10">
                     <Clock className="w-4 h-4" />
                     1 HR Delivery
                   </div>
                 </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-20 mask-gradient-side" />
            </div>
          )}

          {/* Home Feed: Category Carousels or Grid */}
          {!selectedCategoryHandle ? (
            <div className="space-y-16">
              {product_categories.map((cat: any) => {
                const catProducts = allProducts.filter((p: any) => {
                  const pCats = p.categories;
                  if (Array.isArray(pCats)) {
                    return pCats.some((c: any) => c.id === cat.id);
                  }
                  if (pCats && typeof pCats === 'object') {
                    return (pCats as any).id === cat.id;
                  }
                  return false;
                })
                
                if (catProducts.length === 0) return null

                return (
                  <section key={cat.id} className="relative">
                    <div className="flex justify-between items-center mb-6 px-1">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl font-bold border border-border-light instacart-shadow">
                            {cat.handle === "fresh-produce" ? "🥦" : 
                             cat.handle === "pantry" ? "🍞" : 
                             cat.handle === "chocolates" ? "🍫" : "📦"}
                         </div>
                         <div>
                           <h3 className="text-2xl font-black text-foreground tracking-tight">{cat.name}</h3>
                           <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest -mt-1">Hand-picked items</p>
                         </div>
                      </div>
                      <Link href={`/?category=${cat.handle}`} className="flex items-center gap-1 text-primary font-black text-sm hover:underline">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>

                    <div className="flex overflow-x-auto gap-5 pb-8 pt-2 carousel-hide-scrollbar -mx-4 px-4 snap-x">
                      {catProducts.map((product: any) => (
                        <div key={product.id} className="group min-w-[220px] max-w-[220px] snap-start flex flex-col relative bg-white rounded-2xl p-2 hover:instacart-shadow transition-all duration-300">
                          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                             {product.variants?.[0]?.id && (
                                <AddToCart variantId={product.variants[0].id} variant="market" />
                             )}
                          </div>

                          <Link href={`/products/${product.handle}`} className="relative aspect-square mb-4 block overflow-hidden rounded-xl bg-gray-50 border border-gray-100/50">
                            <Image 
                              src={product.thumbnail || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"} 
                              alt={product.title || "Product Image"}
                              fill
                              className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                            />
                          </Link>

                          <div className="flex flex-col flex-1 px-2">
                             <div className="mb-1">
                                <Price amount={product.variants?.[0]?.prices?.[0]?.amount || 0} />
                             </div>
                             <h4 className="text-[14px] font-bold text-gray-800 leading-tight mb-1 line-clamp-2 h-9 group-hover:text-primary transition-colors">{product.title}</h4>
                             <p className="text-[11px] text-gray-400 font-bold mb-3 uppercase tracking-tighter">1 each</p>
                             
                             <div className="mt-auto flex items-center gap-1.5 text-[10px] font-extrabold text-primary pt-3 border-t border-gray-50">
                               <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center text-[10px]">✓</div>
                               Many in Stock
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : (

            <div className="space-y-8">
               <div className="flex items-center gap-4 border-b border-border-light pb-6">
                  <Link href="/" className="text-gray-400 hover:text-primary transition-colors"><ChevronRight className="w-6 h-6 rotate-180" /></Link>
                  <h3 className="text-3xl font-black text-foreground">
                    {product_categories.find((c: any) => c.handle === selectedCategoryHandle)?.name}
                  </h3>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-6">
                 {filteredProducts.map((product: any) => (
                    <div key={product.id} className="group flex flex-col relative">
                       <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          {product.variants?.[0]?.id && (
                             <AddToCart variantId={product.variants[0].id} variant="market" />
                          )}
                       </div>
                       <Link href={`/products/${product.handle}`} className="relative aspect-square mb-3 block overflow-hidden rounded-xl bg-gray-50 border border-gray-100/50">
                         <Image 
                           src={product.thumbnail || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"} 
                           alt={product.title || "Product Image"}
                           fill
                           unoptimized
                           className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                         />
                       </Link>
                       <Price amount={product.variants?.[0]?.prices?.[0]?.amount || 0} />
                       <h4 className="text-[14px] font-bold text-gray-700 leading-tight mb-1 mt-1">{product.title}</h4>
                       <p className="text-[11px] text-gray-400 font-bold mb-3 uppercase">1 unit</p>
                       <div className="mt-auto flex items-center gap-1.5 text-[10px] font-extrabold text-primary">
                          Many in Stock
                       </div>
                    </div>
                 ))}
               </div>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-sidebar border-t border-border-light py-16 px-8 mt-auto">
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
