import { fetchProduct } from "@/lib/medusa"
import Image from "next/image"
import AddToCart from "@/app/components/AddToCart"

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await fetchProduct(handle)

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-[10px] font-bold uppercase tracking-widest">Collection Exhausted / 404</div>
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          {/* IMAGE SIDE */}
          <div className="relative aspect-[4/5] bg-white border border-slate-100 overflow-hidden">
             <Image 
                src={product.thumbnail || "https://images.unsplash.com/photo-1549497538-301288c8549a?q=80&w=1200"} 
                alt={product.title}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
             />
          </div>

          {/* CONTENT SIDE */}
          <div className="flex flex-col pt-10">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-6">Archive / {product.id.slice(0, 5)}</span>
            <h1 className="text-6xl font-black tracking-tighter mb-4">{product.title}</h1>
            <p className="text-xl font-mono text-slate-400 mb-12">
               {product.variants?.[0]?.prices?.[0]?.amount 
                ? `₹${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                : "POA"}
            </p>

            <div className="prose prose-sm text-slate-500 font-medium leading-relaxed max-w-sm mb-16">
               <p>{product.description || "A meticulously crafted object, designed with the principles of reduction and functional clarity."}</p>
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest">Dimension</span>
                  <span className="text-xs font-bold text-slate-400">Variable Range</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest">Material</span>
                  <span className="text-xs font-bold text-slate-400">Industrial Cotton</span>
               </div>
            </div>

            <div className="mt-20 flex gap-4">
               <div className="flex-1">
                 {product.variants?.[0]?.id && (
                   <AddToCart variantId={product.variants[0].id} variant="minimal" />
                 )}
               </div>
               <button className="px-8 py-5 border border-slate-200 text-black text-[10px] font-black uppercase tracking-widest hover:border-black transition-all">
                  ♡
               </button>
            </div>

            <p className="mt-8 text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center">Standard Logistics Apply / 5-7 Day Delivery</p>
          </div>
        </div>

        {/* RELATED SECTION */}
        <section className="mt-48 pt-24 border-t border-slate-100">
           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-12">Related Findings</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
              {[1,2,3,4].map(i => (
                 <div key={i} className="space-y-4">
                    <div className="aspect-[3/4] bg-white border border-slate-50 relative" />
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                       <span>ARCHIVE_0{i}</span>
                       <span>POA</span>
                    </div>
                 </div>
              ))}
           </div>
        </section>
      </main>
    </div>
  )
}
