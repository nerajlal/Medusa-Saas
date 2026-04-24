import { fetchProducts } from "@/lib/medusa"
import Image from "next/image"
import AddToCart from "./components/AddToCart"

export default async function Home() {
  const products = await fetchProducts()


  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans antialiased overflow-x-hidden pt-10">
      <main 
         className="px-6 md:px-12" 
         style={{ maxWidth: '1440px', margin: '0 auto' }}
      >
        {/* SECTION 1: "CURATED CANVAS" HERO */}
        <section className="min-h-[90vh] flex flex-col lg:flex-row items-center gap-20 py-24 mb-32 border-b border-black/5">
          {/* Visual Column */}
          <div className="w-full lg:w-1/2 relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden group shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] rounded-sm">
             <Image 
                src="https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&w=1200&q=80" 
                alt="Architectural Light"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale group-hover:scale-110 transition-transform duration-[3s] ease-in-out"
                priority
             />
             <div className="absolute inset-0 bg-black/5 mix-blend-multiply" />
             <div className="absolute top-10 left-10 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white">Entry / 01</span>
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/50">Observation</span>
             </div>
          </div>

          {/* Editorial Column */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-start pl-0 lg:pl-12">
            <div className="flex flex-col gap-6 mb-16">
               <span className="text-[11px] font-black uppercase tracking-[1em] text-slate-300">Minima // Archive // 2026</span>
               <h2 className="text-8xl md:text-[8rem] font-light tracking-[-0.05em] leading-[0.8] text-black uppercase">
                  Digital<br/>
                  <span className="font-black italic text-black/90">Archive</span>.
               </h2>
            </div>
            
            <div className="max-w-md mb-20">
               <p className="text-2xl text-slate-400 font-medium leading-relaxed mb-12">
                  Exploring the threshold between functional necessity and artistic expression. A curated collection of objects for the considered life.
               </p>
               <div className="flex items-center gap-10">
                  <button className="px-16 py-8 bg-black text-white text-[12px] font-black uppercase tracking-[0.5em] hover:bg-slate-800 transition-all shadow-3xl">
                    Explore Collections
                  </button>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 italic">Established 2026</span>
               </div>
            </div>

            <div className="flex justify-between w-full pt-16 border-t border-black/5 gap-10">
               <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Curation</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black">Aesthetic / Form</span>
               </div>
               <div className="flex flex-col gap-2 text-right">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Coordinate</span>
                  <span className="text-[10px] font-mono font-black text-black">40.7128 N</span>
               </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: NEW ARCHIVAL DROPS (THE GOLD STANDARD) */}
        <section className="py-64 relative border-b border-black/5">
          <div className="flex justify-between items-baseline mb-32">
             <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-300">Collection / 2026</span>
                <h3 className="text-5xl font-black tracking-tighter text-black uppercase">New Archival Drops</h3>
             </div>
            <a href="/collections/all" className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-4 hover:pb-6 transition-all group">
              View Catalog <span className="inline-block group-hover:translate-x-2 transition-transform ml-2">→</span>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-40">
            {products?.map((product: any) => (
              <div key={product.id} className="group cursor-pointer">
                <a href={`/products/${product.handle || product.id}`}>
                  <div className="aspect-[4/5] bg-white relative overflow-hidden mb-12 rounded-sm border border-slate-100 transition-all duration-1000 group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)]">
                    <Image 
                      src={product.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200"} 
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-in-out"
                    />
                    <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="bg-black text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest">Detail View</span>
                    </div>
                  </div>
                </a>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xl font-black uppercase tracking-tight text-black">{product.title}</h4>
                    <span className="text-base font-mono text-slate-400">
                        {product.variants?.[0]?.prices?.[0]?.amount 
                        ? `₹${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                        : "POA"}
                    </span>
                  </div>
                  <div className="h-[2px] w-full bg-black/5" />
                  
                  {product.variants?.[0]?.id && (
                    <AddToCart variantId={product.variants[0].id} />
                  )}

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">In Store / Limited</p>
                    <span className="text-[10px] font-mono text-slate-200 uppercase">#00{product.id?.slice(-2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* SECTION 3: GALLERY DETAIL (ELEVATED) */}
        <section className="py-72 relative">
          <div className="flex justify-between items-baseline mb-32 border-b border-black/5 pb-8">
             <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-300">Observation / 02</span>
             <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-300">Light & Form</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
            <div className="relative aspect-square w-full shadow-[0_50px_120px_-30px_rgba(0,0,0,0.2)]">
               <Image 
                  src="https://images.unsplash.com/photo-1549497538-301288c8549a?auto=format&fit=crop&w=1200&q=80" 
                  alt="Minimal light"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-[2s] ease-in-out"
               />
            </div>
            <div className="max-w-xl pl-0 lg:pl-28">
              <h3 className="text-8xl font-black tracking-[-0.05em] mb-16 leading-[0.85] text-black uppercase">Soft Light.<br/>Still Objects.</h3>
              <p className="text-2xl text-slate-500 leading-relaxed mb-20 font-medium italic">
                Our design process begins with the study of light. How it interacts with surfaces, how it defines space, and how it creates emotion. Every material is chosen for its tactile response and visual silence.
              </p>
              <div className="flex items-center gap-10 group cursor-pointer">
                 <a href="#" className="text-xs font-black uppercase tracking-[0.5em] border-b-2 border-black pb-4 hover:pr-12 transition-all">Read Journal Chapter</a>
                 <span className="text-[10px] text-slate-200 italic">(04 Min Read)</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PHILOSOPHY (RE-ARCHITECTED) */}
        <section className="py-72 text-center relative border-y border-black/5 bg-slate-50/50 -mx-[48px] px-[48px]">
           <div className="flex flex-col items-center mb-40">
              <span className="text-[11px] font-black uppercase tracking-[1.2em] text-slate-200 mb-8">The Foundational Pillar</span>
              <h3 className="text-4xl font-black tracking-tighter text-black uppercase">Our core principles</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-32 max-w-7xl mx-auto">
              {[
                { n: "01", t: "Longevity", d: "Designed for timeless use and generation durability. We reject the ephemeral in favor of the perpetual." },
                { n: "02", t: "Purity", d: "Natural materials sourced from waste-zero origins. Every texture is an honest expression of its source." },
                { n: "03", t: "Honesty", d: "Transparent craftsmanship with zero hidden processes. What you see is precisely what defines the object." }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center p-12 bg-white/50 border border-black/5 group hover:bg-white transition-all duration-700">
                   <span className="text-[6rem] font-black text-black/5 leading-none mb-4 group-hover:text-black transition-colors">{item.n}</span>
                   <h4 className="text-2xl font-black uppercase mb-8 tracking-tighter text-black">{item.t}</h4>
                   <div className="w-12 h-px bg-black/10 mb-8" />
                   <p className="text-sm text-slate-500 leading-[2] max-w-[280px] tracking-normal font-medium">{item.d}</p>
                </div>
              ))}
           </div>
        </section>

        {/* SECTION 5: "THE ARCHITECTURAL ANCHOR" NEWSLETTER (INVERTED) */}
        <section className="py-80 flex flex-col lg:flex-row items-center gap-24 bg-zinc-950 -mx-[48px] px-[48px] pt-40">
           {/* Visual Column */}
           <div className="w-full lg:w-1/2 relative aspect-[16/9] lg:aspect-[4/5] overflow-hidden group shadow-3xl rounded-sm">
              <Image 
                 src="https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&w=1200&q=80" 
                 alt="Minimal Gallery"
                 fill
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 className="object-cover grayscale group-hover:scale-110 transition-transform duration-[3s] ease-in-out hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/40 mix-blend-multiply opacity-40" />
              <div className="absolute bottom-10 left-10">
                 <span className="text-[10px] font-black uppercase tracking-[1em] text-white">Entry / 04</span>
              </div>
           </div>

           {/* Interaction Column */}
           <div className="w-full lg:w-1/2 flex flex-col justify-center items-start pl-0 lg:pl-16">
              <div className="flex flex-col gap-6 mb-24">
                 <span className="text-[11px] font-black uppercase tracking-[1.5em] text-zinc-500">Connection Protocol</span>
                 <h3 className="text-8xl font-black tracking-[-0.07em] mb-8 text-white leading-none uppercase">Join the<br/>Private<br/>Archive.</h3>
              </div>
              
              <div className="w-full max-w-xl">
                 <p className="text-xl text-zinc-400 font-medium leading-relaxed mb-16 uppercase tracking-[0.3em]">
                    Receive architectural notes, archival drops, and exclusive access to the curation logic.
                 </p>
                 <div className="flex flex-col gap-10 w-full">
                    <div className="w-full flex border-b-2 border-zinc-800 pb-10 transition-all focus-within:border-white">
                       <input 
                          type="email" 
                          placeholder="EMAIL@PROTOCOL.COM" 
                          className="bg-transparent flex-1 text-lg font-black tracking-[0.5e] outline-none text-white placeholder:text-zinc-800 uppercase" 
                       />
                       <button className="text-[14px] font-black uppercase tracking-[0.6em] px-12 text-white hover:translate-x-6 transition-transform">Join →</button>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-loose">
                       <span className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                          Encrypted Transmission
                       </span>
                       <span>Digital Entry Point / 01</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>



  )
}

