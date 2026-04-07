import { fetchProducts } from "@/lib/medusa"
import Image from "next/image"

export default async function Home() {
  const { products } = await fetchProducts()

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans antialiased">
      <nav className="max-w-7xl mx-auto px-8 py-10 flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tighter uppercase">Minima <span className="font-light text-slate-400 font-mono">/ A</span></h1>
        <div className="space-x-8 text-sm font-medium text-slate-500 uppercase tracking-widest">
          <a href="#" className="hover:text-black transition-colors">Catalog</a>
          <a href="#" className="hover:text-black transition-colors">Archive</a>
          <a href="#" className="hover:text-black transition-colors underline decoration-1 underline-offset-8">Cart (0)</a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-20 mt-20">
        <header className="mb-32">
          <h2 className="text-6xl font-extrabold tracking-tighter max-w-2xl leading-[0.9]">
            The Essential <span className="font-light italic">Collection.</span>
          </h2>
          <p className="mt-8 text-lg text-slate-500 max-w-md font-medium leading-relaxed">
            Curated objects for a minimalist lifestyle. Purposely simple. Exceptionally crafted.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {products?.map((product: any) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-white relative overflow-hidden mb-6 rounded-sm">
                 <Image 
                    src={product.thumbnail || "https://images.unsplash.com/photo-1549497538-301288c8549a?q=80&w=1000"} 
                    alt={product.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                 />
              </div>
              <div className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-tight">{product.title}</h3>
                <span className="text-sm font-mono text-slate-400">
                  {product.variants?.[0]?.prices?.[0]?.amount 
                    ? `INR ${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                    : "Price on request"}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View Details →</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-8 py-32 mt-40 border-t border-slate-100 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-slate-300">
        <p>© 2026 Minima Multi-tenant. All Rights Reserved.</p>
        <div className="space-x-6">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Instagram</a>
        </div>
      </footer>
    </div>
  )
}
