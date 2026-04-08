import { fetchProducts } from "@/lib/medusa"
import Image from "next/image"

export default async function Home() {
  const products = [
    {
      id: "prod_1",
      title: "Midnight Chronograph",
      thumbnail: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200",
      variants: [{ prices: [{ amount: 1250000 }] }]
    },
    {
      id: "prod_2",
      title: "Onyx Leather Bag",
      thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200",
      variants: [{ prices: [{ amount: 850000 }] }]
    },
    {
      id: "prod_3",
      title: "Carbon Fiber Wallet",
      thumbnail: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200",
      variants: [{ prices: [{ amount: 150000 }] }]
    }
  ]


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="max-w-screen-2xl mx-auto px-10">
        {/* SECTION 1: DRAMATIC HERO */}
        <header className="py-60 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 translate-x-48" />
          <h2 className="text-[12rem] font-black leading-none tracking-tighter opacity-10 select-none absolute -translate-y-20 uppercase">Premium</h2>
          <h2 className="text-9xl font-black tracking-tighter max-w-5xl leading-[0.85] relative z-10 mb-16 uppercase italic">
            Defining <span className="text-neutral-500 font-light">The Standard.</span>
          </h2>
          <p className="mt-8 text-[11px] text-neutral-400 max-w-sm font-bold tracking-[0.4em] leading-relaxed uppercase border-t border-white/10 pt-8">
            Curated objects for the aesthetic vanguard. Unique, numbered, and timeless.
          </p>
        </header>

        {/* SECTION 2: LUXURY GRID */}
        <section className="py-40 border-t border-white/5">
          <div className="flex justify-between items-end mb-24">
            <div>
              <span className="text-[10px] font-black tracking-[0.6em] text-neutral-600 block mb-4 uppercase">Selection / 01</span>
              <h3 className="text-4xl font-black uppercase tracking-tighter">The Private Collection</h3>
            </div>
            <a href="/collections/all" className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-500 hover:text-white transition-all">Explore All →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {products?.map((product: any) => (
              <a href={`/products/${product.handle || product.id}`} key={product.id} className="group flex flex-col items-center text-center">
                <div className="aspect-[4/5] w-full bg-neutral-900/50 border border-white/5 relative overflow-hidden mb-10 group-hover:border-white/20 transition-all duration-1000 shadow-2xl">
                  <Image 
                    src={product.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000"} 
                    alt={product.title}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400 group-hover:text-white transition-colors mb-2">{product.title}</h3>
                <span className="text-sm font-light text-neutral-500 italic">
                  {product.variants?.[0]?.prices?.[0]?.amount 
                    ? `₹${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                    : "By Appointment"}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* SECTION 3: ATELIER STORY */}
        <section className="py-60 border-t border-white/5 flex justify-center">
           <div className="max-w-3xl text-center">
              <span className="text-[10px] font-black tracking-[0.6em] text-neutral-700 block mb-12 uppercase">The Atelier / 02</span>
              <p className="text-5xl font-black italic tracking-tighter leading-tight mb-16 underline decoration-white/10 underline-offset-[20px]">
                "True luxury is not found in the display, but in the silence of perfect craft."
              </p>
              <div className="flex justify-center gap-12 grayscale opacity-40">
                 <div className="w-16 h-1 w-px bg-white/20" />
              </div>
           </div>
        </section>

        {/* SECTION 4: EXCLUSIVE ACCESS */}
        <section className="py-40 bg-neutral-950 -mx-10 px-10 border-y border-white/5">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-32 items-center max-w-screen-2xl mx-auto">
              <div className="relative aspect-[3/2] bg-neutral-900 border border-white/5 overflow-hidden">
                 <Image 
                    src="https://images.unsplash.com/photo-1549497538-301288c8549a?q=80&w=1000" 
                    alt="Noir Membership"
                    fill
                    className="object-cover opacity-40"
                 />
              </div>
              <div className="max-w-md">
                 <span className="text-[10px] font-black tracking-[0.5em] text-neutral-600 block mb-8 uppercase">Membership / 03</span>
                 <h3 className="text-5xl font-black uppercase tracking-tighter mb-8">Noir Privé</h3>
                 <p className="text-sm text-neutral-500 leading-relaxed uppercase tracking-[0.2em] font-bold mb-12">
                    Gain exclusive access to pre-launches, numbered editions, and bespoke manufacturing services.
                 </p>
                 <button className="px-12 py-5 border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all">
                    Apply for Access
                 </button>
              </div>
           </div>
        </section>

        {/* SECTION 5: NEWSLETTER */}
        <section className="py-60 flex flex-col items-center text-center">
           <h3 className="text-[10px] font-black tracking-[0.8em] text-neutral-300 mb-16 uppercase">Join the Manifesto</h3>
           <div className="w-full max-w-xl flex flex-col gap-10">
              <input 
                 type="email" 
                 placeholder="SIGN UP FOR UPDATES" 
                 className="bg-transparent border-b border-white/10 py-6 text-center text-xs font-black uppercase tracking-[0.5em] outline-none focus:border-white transition-all" 
              />
              <button className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 hover:text-white">Submit Findings</button>
           </div>
        </section>
      </main>
    </div>
  )
}

