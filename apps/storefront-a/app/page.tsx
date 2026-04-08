import { fetchProducts } from "@/lib/medusa"
import Image from "next/image"

export default async function Home() {
  const products = [
    {
      id: "prod_1",
      title: "Ceramic Minimalist Vase",
      thumbnail: "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=800&q=80",
      variants: [{ prices: [{ amount: 4500 }] }]
    },
    {
      id: "prod_2",
      title: "Matte Black Desk Lamp",
      thumbnail: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80",
      variants: [{ prices: [{ amount: 7200 }] }]
    },
    {
      id: "prod_3",
      title: "Wool Texture Throw",
      thumbnail: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80",
      variants: [{ prices: [{ amount: 3800 }] }]
    }
  ]


  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans antialiased overflow-x-hidden">
      <main className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* SECTION 1: HERO */}
        <section className="py-48 flex flex-col justify-center min-h-[80vh] border-b border-black/5">
          <h2 className="text-[12rem] font-black tracking-[-0.07em] max-w-6xl leading-[0.7] mb-32 text-black">
            The Essential Archive<span className="font-light italic text-slate-200">.</span>
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-start gap-20">
            <div className="max-w-2xl">
               <p className="text-3xl text-slate-400 font-medium leading-[1.4] mb-12">
                 Curating objects redefined for the modern minimalist. Functional reduction as a design philosophy for your everyday surroundings.
               </p>
               <div className="flex items-center gap-10">
                  <button className="px-14 py-7 bg-black text-white text-[12px] font-black uppercase tracking-[0.5em] hover:bg-slate-800 transition-all shadow-2xl">
                    Explore Objects
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Volume / 01</span>
               </div>
            </div>
            <div className="hidden lg:flex flex-col items-end gap-4 text-right">
               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300">Aesthetic / Utility</span>
               <span className="text-sm font-mono text-slate-400">40.7128° N, 74.0060° W</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: FEATURED GRID */}
        <section className="py-64 relative">
          <div className="flex justify-between items-baseline mb-32">
             <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-300">Collection / 2026</span>
                <h3 className="text-4xl font-black tracking-tighter">New Archival Drops</h3>
             </div>
            <a href="/collections/all" className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-3 hover:pb-4 transition-all">View All Products</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-40">
            {products?.map((product: any) => (
              <a href={`/products/${product.handle || product.id}`} key={product.id} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-white relative overflow-hidden mb-12 rounded-sm border border-slate-100 transition-all duration-1000 group-hover:shadow-3xl">
                  <Image 
                    src={product.thumbnail || "https://images.unsplash.com/photo-1549497538-301288c8549a?q=80&w=1200"} 
                    alt={product.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-black uppercase tracking-tight">{product.title}</h4>
                    <span className="text-sm font-mono text-slate-400">
                        {product.variants?.[0]?.prices?.[0]?.amount 
                        ? `₹${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                        : "POA"}
                    </span>
                  </div>
                  <div className="h-px w-full bg-black/5" />
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">In Store / Limited</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* SECTION 3: GALLERY DETAIL */}
        <section className="py-64 bg-slate-50 -mx-[48px] px-[48px] border-y border-slate-100 relative mb-20">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
            <div className="relative aspect-square w-full shadow-3xl">
               <Image 
                  src="https://images.unsplash.com/photo-1549497538-301288c8549a?auto=format&fit=crop&w=1200&q=80" 
                  alt="Minimal light"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-[1.5s]"
               />
            </div>
            <div className="max-w-xl pl-0 lg:pl-24">
              <span className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-300 mb-16 block">Observation / 02</span>
              <h3 className="text-8xl font-black tracking-[-0.05em] mb-16 leading-[0.8] text-black">Soft Light. Still Objects.</h3>
              <p className="text-2xl text-slate-500 leading-relaxed mb-20 font-medium italic">
                Our design process begins with the study of light. How it interacts with surfaces, how it defines space, and how it creates emotion. Every material is chosen for its tactile response.
              </p>
              <a href="#" className="text-xs font-black uppercase tracking-[0.5em] border-b-2 border-black pb-4 hover:pr-8 transition-all">Read Journal Chapter</a>
            </div>
          </div>
        </section>

        {/* SECTION 4: PHILOSOPHY */}
        <section className="py-64 text-center relative border-b border-black/5">
           <span className="text-[11px] font-black uppercase tracking-[1em] text-slate-300 mb-24 block">The Foundational Pillar</span>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-40 max-w-6xl mx-auto">
              <div className="flex flex-col items-center group">
                 <div className="w-16 h-px bg-black/10 mb-12 group-hover:w-24 transition-all" />
                 <h4 className="text-xl font-black uppercase mb-8 tracking-tighter text-black">Longevity</h4>
                 <p className="text-xs text-slate-400 leading-loose font-bold uppercase tracking-[0.4em] max-w-[200px]">Designed for timeless use and generation durability.</p>
              </div>
              <div className="flex flex-col items-center group">
                 <div className="w-16 h-px bg-black/10 mb-12 group-hover:w-24 transition-all" />
                 <h4 className="text-xl font-black uppercase mb-8 tracking-tighter text-black">Purity</h4>
                 <p className="text-xs text-slate-400 leading-loose font-bold uppercase tracking-[0.4em] max-w-[200px]">Natural materials sourced from waste-zero origins.</p>
              </div>
              <div className="flex flex-col items-center group">
                 <div className="w-16 h-px bg-black/10 mb-12 group-hover:w-24 transition-all" />
                 <h4 className="text-xl font-black uppercase mb-8 tracking-tighter text-black">Honesty</h4>
                 <p className="text-xs text-slate-400 leading-loose font-bold uppercase tracking-[0.4em] max-w-[200px]">Transparent craftsmanship with zero hidden processes.</p>
              </div>
           </div>
        </section>

        {/* SECTION 5: NEWSLETTER */}
        <section className="py-80 flex flex-col items-center text-center relative">
           <span className="text-[12px] font-black uppercase tracking-[1.2em] text-slate-200 mb-20 block">Connection Protocol</span>
           <h3 className="text-7xl font-black tracking-[-0.06em] mb-16 text-black">Stay in the Loop.</h3>
           <p className="text-slate-400 text-lg mb-24 max-w-xl font-medium leading-[1.8] uppercase tracking-[0.3em]">Be the first to know about new archival drops,<br/> internal exhibitions, and design notes.</p>
           <div className="w-full max-w-2xl flex border-b-2 border-black pb-6">
              <input type="email" placeholder="EMAIL ADDRESS" className="bg-transparent flex-1 text-sm font-black tracking-[0.5em] outline-none placeholder:text-slate-200" />
              <button className="text-[12px] font-black uppercase tracking-[0.5em] px-10 hover:translate-x-4 transition-transform">Join →</button>
           </div>
        </section>
      </main>
    </div>



  )
}

