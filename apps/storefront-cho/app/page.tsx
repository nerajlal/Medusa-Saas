import { fetchProducts, fetchProductCategories } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import AddToCart from "./components/AddToCart"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default async function Home(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const selectedCategoryHandle = searchParams.category;

  const { product_categories } = await fetchProductCategories()
  
  // Filter products by category if one is selected
  const productParams: Record<string, string> = {}
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
      
      {/* Simple Premium Hero */}
      <section className="bg-white py-12 md:py-24 border-b border-gray-50">
         <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-8 text-center md:text-left">
               <div className="inline-flex items-center gap-2 bg-yellow-50 text-primary px-4 py-2 rounded-full border border-yellow-100 animate-pulse">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Now Delivering Nationwide</span>
               </div>
               <h2 className="text-5xl md:text-7xl font-black text-black leading-[0.9] tracking-tighter uppercase italic">
                  Premium <br/> 
                  Wholesale <br/>
                  <span className="text-primary not-italic">Treats.</span>
               </h2>
               <p className="text-gray-500 font-bold max-w-md mx-auto md:mx-0 text-sm md:text-base leading-relaxed">
                  The UAE's trusted partner for high-quality snacks, chocolates, and fresh produce. Curated for your retail happiness.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/products" className="bg-black text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:bg-gray-800 shadow-xl shadow-black/10">
                     Shop Catalog
                  </Link>
                  <a href="#categories" className="bg-white text-black border-2 border-gray-100 px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:border-primary">
                     Browse Categories
                  </a>
               </div>
            </div>
            <div className="hidden lg:flex flex-1 justify-end">
               <div className="relative w-80 h-80 bg-primary/10 rounded-full flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-dashed border-primary/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
                  <span className="text-[140px] drop-shadow-2xl">🍫</span>
                  <div className="absolute -top-4 -right-4 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 rotate-12">
                     <span className="text-4xl text-primary font-black">100%</span>
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Freshness<br/>Guaranteed</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Circular Category Slider - Iconic Chocolayt Feature */}
      <section id="categories" className="py-8 border-b border-gray-50 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex overflow-x-auto py-2 gap-6 md:gap-10 scrollbar-hide">
               <Link href="/" className="flex flex-col items-center gap-3 shrink-0 group">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-sm ${!selectedCategoryHandle ? 'bg-primary border-4 border-yellow-200 scale-110 shadow-lg shadow-yellow-200' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                     📦
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest ${!selectedCategoryHandle ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>All</span>
               </Link>
               {product_categories.map((cat: any) => (
                 <Link key={cat.id} href={`/?category=${cat.handle}`} className="flex flex-col items-center gap-3 shrink-0 group">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-sm ${selectedCategoryHandle === cat.handle ? 'bg-primary border-4 border-yellow-200 scale-110 shadow-lg shadow-yellow-200' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                       {categoryIconMap[cat.handle] || "🛍️"}
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${selectedCategoryHandle === cat.handle ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>{cat.name}</span>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-20">
        
        {/* Products Grid - Redesigned Card Style */}
        <section>
           <div className="mb-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
              <div className="text-center md:text-left">
                 <h3 className="text-3xl font-black text-black uppercase tracking-tighter">
                   {selectedCategoryHandle 
                     ? product_categories.find((c: any) => c.handle === selectedCategoryHandle)?.name 
                     : "Top Wholesale Picks"}
                 </h3>
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2">Curated for your store</p>
              </div>
              <Link href="/products" className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-colors">
                 View all products <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
             {products?.length > 0 ? products.map((product: any) => (
               <div key={product.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-yellow-100 transition-all duration-300 flex flex-col h-full overflow-hidden">
                 
                 {/* Title Top - Chocolayt Style */}
                 <div className="p-5 pb-0">
                    <h4 className="text-[13px] font-black text-gray-800 leading-tight line-clamp-2 h-8 group-hover:text-primary transition-colors uppercase">{product.title}</h4>
                 </div>

                 <Link href={`/products/${product.handle}`} className="flex-1 relative aspect-square flex items-center justify-center p-8">
                    <Image 
                      src={product.thumbnail || "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000"} 
                      alt={product.title}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                 </Link>
                 
                 <div className="p-5 pt-0 space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Price </span>
                       <span className="text-lg font-black text-black">
                         {(() => {
                           const aedPrice = product.variants?.[0]?.prices?.find((p: any) => p.currency_code === "aed");
                           return aedPrice 
                             ? `AED ${(aedPrice.amount / 100).toLocaleString()}` 
                             : "N/A";
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
             )) : (
               <div className="col-span-full py-20 text-center">
                 <p className="text-gray-500 font-medium">No results found for this category.</p>
               </div>
             )}
           </div>
        </section>

        {/* Promo Banner */}
        <section className="relative rounded-[3rem] bg-[#FFFBEB] border-2 border-primary/20 p-10 md:p-20 overflow-hidden flex flex-col md:flex-row items-center gap-10">
           <div className="flex-1 space-y-6">
              <span className="bg-primary text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-[0.2em]">Bulk Buy Hero</span>
              <h3 className="text-4xl md:text-5xl font-black text-black leading-tight">Fill your shelves <br/> with <span className="underline decoration-primary decoration-8 underline-offset-4 text-gradient">Happiness.</span></h3>
              <p className="text-gray-600 font-bold max-w-md">Our weekly restock is here. Get early access to premium fresh produce and trending snacks.</p>
              <button className="bg-black text-white px-10 py-5 rounded-2xl text-base font-black transition-all hover:bg-gray-800 shadow-xl shadow-black/10">Browse Full Catalog</button>
           </div>
           <div className="hidden md:flex w-64 h-64 bg-primary/20 rounded-full items-center justify-center animate-bounce">
              <span className="text-8xl">🛍️</span>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

