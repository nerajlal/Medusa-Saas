import { fetchCollectionByHandle, fetchProducts } from "@/lib/medusa"
import Image from "next/image"

export default async function CollectionPage({ params }: { params: { handle: string } }) {
  const collection = await fetchCollectionByHandle(params.handle)
  const { products } = await fetchProducts()

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-24 flex justify-between items-end">
          <div className="max-w-xl">
             <span className="text-blue-600 font-black uppercase tracking-widest text-[10px] mb-4 block">Official Series / {collection?.id || "CAT-001"}</span>
             <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-none mb-8">{collection?.title || "The Vault"}</h1>
             <p className="text-lg text-slate-400 font-medium leading-relaxed">
                {collection?.description || "Explore our most popular performance gear. High-demand items curated for the modern athlete and enthusiast."}
             </p>
          </div>
          <div className="flex gap-4">
             <button className="bg-white border border-slate-200 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-600 transition-all">Filter</button>
             <button className="bg-white border border-slate-200 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-600 transition-all">Sort</button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {products?.map((product: any) => (
             <a href={`/products/${product.handle || product.id}`} key={product.id} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group flex flex-col h-full shadow-lg shadow-slate-200/40">
                <div className="aspect-square bg-slate-50 relative overflow-hidden mb-8 rounded-[1.5rem] flex items-center justify-center">
                   <Image 
                      src={product.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000"} 
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-all duration-700 ease-in-out"
                   />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900 border border-slate-100">
                      ⚡ Quick Buy
                   </div>
                </div>
                
                <h3 className="text-sm font-black text-slate-800 line-clamp-1 mb-4 group-hover:text-blue-600 transition-colors uppercase italic">{product.title}</h3>
                
                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                  <span className="text-xl font-black italic text-slate-900 leading-none pt-1">
                    {product.variants?.[0]?.prices?.[0]?.amount 
                      ? `₹${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                      : "Out of Stock"}
                  </span>
                  <button className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-900 transition-colors shadow-lg">
                    →
                  </button>
                </div>
             </a>
           ))}
        </section>

        <footer className="mt-40 bg-slate-900 rounded-[3rem] p-16 flex flex-col items-center text-center">
            <h3 className="text-4xl font-black text-white italic mb-6">Need more options?</h3>
            <p className="text-slate-400 font-medium mb-10 max-w-sm">Contact our live concierge for product sourcing and bulk orders in your region.</p>
            <button className="bg-blue-600 text-white px-10 py-5 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30">
               Support Ticket
            </button>
        </footer>
      </main>
    </div>
  )
}
