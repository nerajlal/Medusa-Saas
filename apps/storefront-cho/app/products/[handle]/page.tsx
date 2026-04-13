import { fetchProduct } from "@/lib/medusa"
import Image from "next/image"

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await fetchProduct(params.handle)

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-9xl font-black text-slate-200 mb-8 italic">404</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest">Product not found in this region.</p>
        <a href="/" className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest">Back to Store</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* PRODUCT IMAGES */}
            <div className="space-y-6">
               <div className="aspect-square bg-slate-50 rounded-[2.5rem] relative overflow-hidden border border-slate-100">
                  <Image 
                    src={product.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200"} 
                    alt={product.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    In Stock / Ready to Ship
                  </div>
               </div>
               <div className="grid grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => (
                     <div key={i} className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                  ))}
               </div>
            </div>

            {/* PRODUCT BUY BOX */}
            <div className="flex flex-col">
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">Performance / Gear</span>
                     <h1 className="text-5xl font-black italic tracking-tighter leading-none mb-4">{product.title}</h1>
                     <div className="flex items-center gap-2 text-amber-500">
                        <span>★★★★★</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 cursor-pointer">(128 Reviews)</span>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl">
                     <span className="text-3xl font-black italic">
                        {product.variants?.[0]?.prices?.[0]?.amount 
                          ? `₹${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                          : "Sold Out"}
                     </span>
                  </div>
               </div>

               <p className="text-slate-400 font-medium leading-relaxed mb-10 border-l-4 border-blue-600 pl-6">
                  {product.description || "The ultimate performance upgrade. Designed for high-impact use-cases and tested in extreme conditions. Lightweight, durable, and conversion-ready."}
               </p>

               <div className="space-y-8 mb-12">
                  <div>
                     <h4 className="text-[11px] font-black uppercase tracking-widest mb-4">Select Option</h4>
                     <div className="flex gap-3">
                        {['S', 'M', 'L', 'XL'].map(size => (
                           <button key={size} className="w-12 h-12 rounded-xl border border-slate-200 text-xs font-black hover:border-blue-600 hover:text-blue-600 transition-all">{size}</button>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="flex gap-4 mt-auto">
                  <button className="flex-1 bg-blue-600 text-white py-6 rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">
                     Add to Cart • Instant Checkout
                  </button>
                  <button className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center hover:bg-slate-800 transition-colors shadow-xl">
                     ♡
                  </button>
               </div>

               <div className="mt-12 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                     <span className="text-xl">✈️</span>
                     <span className="text-[10px] font-black uppercase tracking-tight text-slate-500">Fast Express Shipping</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                     <span className="text-xl">🛡️</span>
                     <span className="text-[10px] font-black uppercase tracking-tight text-slate-500">2-Year Full Warranty</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* TECH SPECS TABS */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
           {['Materials', 'Care Instructions', 'Sustainability'].map(title => (
              <div key={title} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-shadow">
                 <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-blue-600">{title}</h4>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Designed with high-performance synthetic blends to ensure maximum durability and breathability in all conditions.
                 </p>
              </div>
           ))}
        </div>
      </main>
    </div>
  )
}
