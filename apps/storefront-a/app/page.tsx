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
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans antialiased">
      <main className="max-w-7xl mx-auto px-8">
        {/* SECTION 1: HERO */}
        <header className="py-32 mt-10">
          <h2 className="text-8xl font-black tracking-tighter max-w-4xl leading-[0.85] mb-12">
            The Essential <span className="font-light italic text-slate-300">Archive.</span>
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <p className="text-xl text-slate-400 max-w-md font-medium leading-relaxed">
              A curated selection of objects redefined for the modern minimalist. Functional beauty for your everyday surroundings.
            </p>
            <button className="px-10 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-slate-800 transition-all">
              Explore Collection
            </button>
          </div>
        </header>

        {/* SECTION 2: FEATURED GRID */}
        <section className="py-32 border-t border-slate-100">
          <div className="flex justify-between items-baseline mb-16">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Featured / 01</h3>
            <a href="/collections/all" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">View All</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {products?.map((product: any) => (
              <a href={`/products/${product.handle || product.id}`} key={product.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-white relative overflow-hidden mb-6 rounded-sm border border-slate-50">
                  <Image 
                    src={product.thumbnail || "https://images.unsplash.com/photo-1549497538-301288c8549a?q=80&w=1000"} 
                    alt={product.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                  />
                </div>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold uppercase tracking-tight">{product.title}</h3>
                  <span className="text-sm font-mono text-slate-400">
                    {product.variants?.[0]?.prices?.[0]?.amount 
                      ? `₹${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                      : "Price on request"}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* SECTION 3: GALLERY DETAIL */}
        <section className="py-40 bg-white -mx-8 px-8 border-y border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="relative aspect-square">
               <Image 
                  src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000" 
                  alt="Minimal light"
                  fill
                  className="object-cover grayscale"
               />
            </div>
            <div className="max-w-md">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8 block">Texture / 02</span>
              <h3 className="text-5xl font-black tracking-tight mb-8">Light & Atmosphere.</h3>
              <p className="text-slate-500 leading-relaxed mb-10 font-medium">
                Our design process begins with the study of light. How it interacts with surfaces, how it defines space, and how it creates emotion. Every material is chosen for its tactile response.
              </p>
              <a href="#" className="text-xs font-black uppercase tracking-widest border-b-2 border-slate-100 pb-2 hover:border-black transition-all">Read the Journal</a>
            </div>
          </div>
        </section>

        {/* SECTION 4: PHILOSOPHY */}
        <section className="py-48 text-center bg-slate-50 -mx-8 px-8">
           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-12">Our Values</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-20 max-w-5xl mx-auto">
              <div>
                 <h4 className="text-sm font-black uppercase mb-4 tracking-tighter">Longevity</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-widest">Designed for timeless use.</p>
              </div>
              <div>
                 <h4 className="text-sm font-black uppercase mb-4 tracking-tighter">Purity</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-widest">Natural materials, zero waste.</p>
              </div>
              <div>
                 <h4 className="text-sm font-black uppercase mb-4 tracking-tighter">Honesty</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-widest">Transparent craft processes.</p>
              </div>
           </div>
        </section>

        {/* SECTION 5: NEWSLETTER */}
        <section className="py-40 border-t border-slate-100 flex flex-col items-center text-center">
           <h3 className="text-4xl font-black tracking-tighter mb-8">Stay in the Loop.</h3>
           <p className="text-slate-400 text-sm mb-12 max-w-sm font-medium">Be the first to know about new archival drops and curated exhibitions.</p>
           <div className="w-full max-w-md flex border-b border-black pb-2">
              <input type="email" placeholder="EMAIL ADDRESS" className="bg-transparent flex-1 text-[10px] font-bold tracking-widest outline-none" />
              <button className="text-[10px] font-black uppercase tracking-widest px-4 hover:translate-x-1 transition-transform">Join →</button>
           </div>
        </section>
      </main>
    </div>
  )
}

