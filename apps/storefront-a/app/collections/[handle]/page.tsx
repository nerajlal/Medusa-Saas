import { fetchCollectionByHandle, fetchProducts } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const collection = await fetchCollectionByHandle(handle)
  const products = await fetchProducts()
  
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="max-w-7xl mx-auto px-8 py-20">
        <header className="mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 block mb-6 px-1">Archive / Collection</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase leading-none">
             {handle.split('-').join(' ')}
          </h1>

          <p className="text-lg text-slate-400 max-w-xl font-medium leading-relaxed italic">
             {collection?.description || "A selection of curated pieces representing our core philosophy of functional reduction."}
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-32 relative">
          {products?.map((product: any) => (
            <Link href={`/products/${product.handle || product.id}`} key={product.id} className="group cursor-pointer block relative">
              <div className="aspect-[3/4] bg-white relative overflow-hidden mb-8 rounded-sm border border-slate-50 w-full h-full min-h-[350px]">
                <Image 
                  src={product.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000"} 
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                />
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-black uppercase tracking-tight">{product.title}</h3>
                    <span className="text-sm font-mono text-slate-400">
                       {product.variants?.[0]?.prices?.[0]?.amount 
                        ? `₹${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                        : "POA"}
                    </span>
                 </div>
                 <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Standard Supply</p>
              </div>
            </Link>
          ))}
        </section>

        <footer className="mt-48 pt-24 border-t border-slate-100 flex justify-center">
            <button className="text-[10px] font-black uppercase tracking-[0.4em] bg-white border border-slate-200 px-12 py-5 hover:bg-black hover:text-white transition-all">
               Load More / Archive
            </button>
        </footer>
      </main>
    </div>
  )
}
