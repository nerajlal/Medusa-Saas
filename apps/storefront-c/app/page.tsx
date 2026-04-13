import { fetchProducts } from "@/lib/medusa"
import Image from "next/image"
import AddToCart from "./components/AddToCart"

export default async function Home() {
  const products = await fetchProducts()


  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-6">
        {/* SECTION 1: PROMO HERO */}
        <section className="mt-12 mb-24 relative rounded-[3rem] overflow-hidden bg-slate-900 aspect-[21/9] flex items-center px-12 md:px-24">
           <div className="relative z-10 max-w-2xl">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">New Season drop</span>
              <h2 className="text-6xl md:text-7xl font-black text-white leading-tight mb-8 italic">
                 Gear Up for the <span className="text-blue-500">Next Level.</span>
              </h2>
              <div className="flex gap-4">
                 <button className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:bg-blue-500 transition-all">
                    Shop Collection
                 </button>
                 <button className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                    Learn More
                 </button>
              </div>
           </div>
           {/* Abstract Shape */}
           <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-32" />
        </section>

        {/* SECTION 2: CATEGORIES */}
        <section className="mb-32">
           <div className="flex justify-between items-end mb-12">
              <h3 className="text-3xl font-black italic">Major Categories</h3>
              <a href="#" className="text-xs font-black text-blue-600 uppercase tracking-widest underline underline-offset-8">Explore Planet →</a>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Footwear', 'Apparel', 'Accessories', 'Digital'].map((cat, i) => (
                 <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center group cursor-pointer hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all">
                    <div className="w-20 h-20 bg-slate-50 rounded-full mb-6 flex items-center justify-center text-2xl group-hover:bg-blue-50 transition-colors">📦</div>
                    <h4 className="text-sm font-black uppercase tracking-tighter">{cat}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">324 Items</p>
                 </div>
              ))}
           </div>
        </section>

        {/* SECTION 3: TRENDING GRID */}
        <section className="mb-32 bg-white -mx-6 px-6 py-32 rounded-[4rem] border-y border-slate-100">
          <div className="max-w-7xl mx-auto">
             <div className="flex justify-between items-baseline mb-16">
                <div>
                   <h3 className="text-4xl font-black italic mb-2 tracking-tighter">Trending Now</h3>
                   <p className="text-slate-400 font-medium">Fast-moving items in your region.</p>
                </div>
                <div className="flex gap-2">
                   <button className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center font-black hover:bg-slate-50">←</button>
                   <button className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center font-black hover:bg-slate-50">→</button>
                </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {products?.map((product: any) => (
                 <div key={product.id} className="bg-slate-50 rounded-[2rem] p-4 group border border-transparent hover:border-blue-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/40">
                   <a href={`/products/${product.handle || product.id}`}>
                    <div className="aspect-square relative overflow-hidden mb-6 rounded-2xl bg-white flex items-center justify-center">
                      <Image 
                        src={product.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000"} 
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-all duration-500 ease-in-out"
                      />
                      <div className="absolute top-4 left-4 bg-blue-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full">Top Rated</div>
                    </div>
                   </a>
                   <div className="px-1">
                      <h3 className="text-xs font-black line-clamp-1 mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{product.title}</h3>
                      <div className="mb-6">
                          <span className="text-lg font-black italic block">
                             {product.variants?.[0]?.prices?.[0]?.amount 
                               ? `₹${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                               : "Sold Out"}
                          </span>
                      </div>
                      
                      {product.variants?.[0]?.id && (
                        <AddToCart variantId={product.variants[0].id} />
                      )}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </section>


        {/* SECTION 4: TRUST BADGES */}
        <section className="mb-32 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex items-center gap-6 p-8 bg-blue-50 rounded-[2.5rem]">
               <div className="text-3xl">🚀</div>
               <div>
                  <h4 className="text-sm font-black uppercase">Rapid Delivery</h4>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">24H Processing</p>
               </div>
            </div>
            <div className="flex items-center gap-6 p-8 bg-amber-50 rounded-[2.5rem]">
               <div className="text-3xl">🛡️</div>
               <div>
                  <h4 className="text-sm font-black uppercase">Secure Checkout</h4>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">SSL Shielded</p>
               </div>
            </div>
            <div className="flex items-center gap-6 p-8 bg-green-50 rounded-[2.5rem]">
               <div className="text-3xl">↩️</div>
               <div>
                  <h4 className="text-sm font-black uppercase">Easy Returns</h4>
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">30rd Policy</p>
               </div>
            </div>
        </section>

        {/* SECTION 5: NEWSLETTER */}
        <section className="mb-40 bg-blue-600 rounded-[4rem] p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-200">
           <div className="relative z-10">
              <h3 className="text-5xl font-black text-white mb-6 italic tracking-tighter">Get exclusive price drops.</h3>
              <p className="text-blue-100 font-medium mb-12 max-w-lg mx-auto">Join over 12,000+ shoppers and get instant alerts on high-demand restocks.</p>
              <div className="max-w-md mx-auto flex gap-4 bg-white p-2 rounded-3xl">
                 <input type="email" placeholder="Enter your email" className="bg-transparent flex-1 px-6 outline-none text-sm font-bold" />
                 <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors">Secure Spot</button>
              </div>
           </div>
           <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </section>
      </main>
    </div>
  )
}

