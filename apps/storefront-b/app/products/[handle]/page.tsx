import { fetchProduct } from "@/lib/medusa"
import Image from "next/image"
import AddToCart from "@/app/components/AddToCart"

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await fetchProduct(handle)

  if (!product) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white text-[10px] font-black uppercase tracking-[0.5em]">Object Not Located / 404</div>
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="max-w-screen-2xl mx-auto px-10 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          {/* LARGE IMAGE AREA */}
          <div className="lg:col-span-7">
             <div className="aspect-[4/5] bg-neutral-900 border border-white/5 relative overflow-hidden shadow-2xl">
                <Image 
                   src={product.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200"} 
                   alt={product.title}
                   fill
                   className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-1000"
                />
             </div>
          </div>

          {/* SIDE SPECIFICATION */}
          <div className="lg:col-span-5 flex flex-col pt-20">
             <span className="text-[10px] font-black tracking-[0.6em] text-neutral-600 block mb-6 uppercase">Series / {product.id.slice(0, 8)}</span>
             <h1 className="text-7xl font-black tracking-tighter mb-6 uppercase italic leading-none">{product.title}</h1>
             <p className="text-2xl font-light text-neutral-400 mb-12 italic">
                {product.variants?.[0]?.prices?.[0]?.amount 
                 ? `₹ ${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                 : "By Request"}
             </p>

             <div className="border-y border-white/5 py-12 mb-12">
                <p className="text-sm text-neutral-500 font-bold uppercase tracking-[0.2em] leading-relaxed mb-8">
                   {product.description || "An uncompromising exploration of form and materiality. Released in limited quantities for individuals who define their own space."}
                </p>
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-700 block mb-2">Origin</span>
                      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Italy / Bespoke</p>
                   </div>
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-700 block mb-2">Season</span>
                      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Permanent Collection</p>
                   </div>
                </div>
             </div>

             <div className="mt-20 flex gap-12 items-center">
               <div className="w-64">
                 {product.variants?.[0]?.id && (
                   <AddToCart variantId={product.variants[0].id} variant="minimal" />
                 )}
               </div>
               <button className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 hover:text-white transition-colors">
                  Inquire
               </button>
            </div>

             <p className="mt-12 text-[9px] font-black uppercase tracking-[0.6em] text-neutral-700 text-center">Encrypted Shipping / Insured Worldwide</p>
          </div>
        </div>

        {/* ATELIER DETAILS */}
        <section className="mt-60 pt-32 border-t border-white/5">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-200">The Material</h4>
                 <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest leading-loose">
                    Utilizing only the highest grade of architectural materials to ensure infinite longevity.
                 </p>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-200">The Method</h4>
                 <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest leading-loose">
                    Hand-finished in our central atelier with a focus on structural integrity and finish.
                 </p>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-200">The Ethics</h4>
                 <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest leading-loose">
                    Every piece is produced on-demand to minimize environmental footprint and maximize exclusivity.
                 </p>
              </div>
           </div>
        </section>
      </main>
    </div>
  )
}
