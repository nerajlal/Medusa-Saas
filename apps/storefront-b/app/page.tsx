import { fetchProducts } from "@/lib/medusa"
import Image from "next/image"

export default async function Home() {
  const { products } = await fetchProducts()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-gold-500/30 antialiased">
      {/* Luxury Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#050505] -z-10" />
      
      <nav className="max-w-screen-2xl mx-auto px-10 py-12 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-black tracking-[0.3em] uppercase bg-gradient-to-r from-neutral-200 via-neutral-500 to-neutral-200 bg-clip-text text-transparent">
          NOIR <span className="font-thin text-neutral-600">/ B</span>
        </h1>
        <div className="hidden md:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-500">
          <a href="#" className="hover:text-white transition-all hover:tracking-[0.5em]">Collections</a>
          <a href="#" className="hover:text-white transition-all hover:tracking-[0.5em]">Bespeak</a>
          <a href="#" className="hover:text-white transition-all hover:tracking-[0.5em] text-neutral-200 border-b border-neutral-200/20 pb-1">Shop</a>
        </div>
      </nav>

      <main className="max-w-screen-2xl mx-auto px-10 pt-40 pb-40">
        <div className="flex flex-col mb-40 text-center items-center">
          <h2 className="text-[12rem] font-black leading-none tracking-tighter opacity-10 select-none absolute -translate-y-20">PREMIUM</h2>
          <h2 className="text-8xl font-black tracking-tighter max-w-4xl leading-[0.85] relative z-10">
            Timeless Elegance. <span className="text-neutral-500 font-light italic italic">Defining Modern Luxury.</span>
          </h2>
          <p className="mt-12 text-sm text-neutral-400 max-w-lg font-medium tracking-wide leading-relaxed uppercase">
            Exclusive products curated for the discerning few. 
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {products?.map((product: any) => (
            <div key={product.id} className="group relative">
              <div className="aspect-[4/5] bg-neutral-900 border border-white/5 relative overflow-hidden group-hover:border-white/20 transition-all duration-1000 shadow-2xl">
                 <Image 
                    src={product.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000"} 
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-all duration-1000 ease-in-out opacity-80 group-hover:opacity-100"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <button className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                    Add to Collection
                 </button>
              </div>
              <div className="mt-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 group-hover:text-white transition-colors">{product.title}</h3>
                    <p className="mt-1 text-[10px] font-bold text-neutral-600 uppercase tracking-widest leading-none">Limited Edition</p>
                  </div>
                  <span className="text-sm font-light text-neutral-200">
                    {product.variants?.[0]?.prices?.[0]?.amount 
                      ? `₹ ${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                      : "Price on Request"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-white/5 bg-neutral-950 py-32 px-10">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
          <h4 className="text-4xl font-black tracking-tighter text-neutral-800 uppercase">Noir / Storefront</h4>
          <div className="flex gap-20 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600">
            <div className="flex flex-col gap-4">
              <span className="text-neutral-400">Services</span>
              <a href="#">Privé</a>
              <a href="#">Concierge</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-neutral-400">Legal</span>
              <a href="#">Privacy</a>
              <a href="#">Manifesto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
