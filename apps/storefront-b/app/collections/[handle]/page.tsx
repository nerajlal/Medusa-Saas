import { fetchCollectionByHandle, fetchProducts } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const collection = await fetchCollectionByHandle(handle)
  const products = await fetchProducts()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="max-w-screen-2xl mx-auto px-10 py-32">
        <header className="mb-40 flex flex-col items-center text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-neutral-600 block mb-10">Private Collection Archive</span>
          <h1 className="text-[10rem] font-black tracking-tighter mb-16 uppercase italic opacity-80 leading-none">{collection?.title || "Limited Series"}</h1>
          <p className="text-sm text-neutral-500 max-w-2xl font-bold tracking-widest uppercase leading-loose pt-12 border-t border-white/5">
             {collection?.description || "Curating the finest in contemporary aesthetic functionalism. Produced in extreme moderation."}
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-24 gap-y-48">
          {products?.map((product: any) => (
             <Link href={`/products/${product.handle || product.id}`} key={product.id} className="group flex flex-col items-center">
                <div className="aspect-[4/5] w-full bg-neutral-900 border border-white/5 relative overflow-hidden mb-12 shadow-2xl">
                   <Image 
                      src={product.thumbnail || "https://images.unsplash.com/photo-1549497538-301288c8549a?q=80&w=1200"} 
                      alt={product.title}
                      fill
                      className="object-cover opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>
                <div className="flex flex-col items-center">
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400 group-hover:text-white transition-colors mb-4">{product.title}</h3>
                   <div className="flex items-center gap-6">
                      <span className="w-8 h-px bg-white/5" />
                      <span className="text-sm font-light text-neutral-500 italic">
                        {product.variants?.[0]?.prices?.[0]?.amount 
                          ? `₹ ${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                          : "By Invitation"}
                      </span>
                      <span className="w-8 h-px bg-white/5" />
                   </div>
                </div>
             </Link>
          ))}
        </section>

        <footer className="mt-80 flex flex-col items-center border-t border-white/5 pt-40 pb-20">
            <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-neutral-700 mb-12">Collection Persistence</h4>
            <div className="flex gap-20">
               <span className="text-[8px] font-black text-neutral-500 tracking-[0.2em] uppercase cursor-pointer hover:text-white">Page 01 / 05</span>
               <span className="text-xs text-neutral-500">→</span>
            </div>
        </footer>
      </main>
    </div>
  )
}
