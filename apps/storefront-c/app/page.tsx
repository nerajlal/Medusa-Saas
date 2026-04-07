import { fetchProducts } from "@/lib/medusa"
import Image from "next/image"

export default async function Home() {
  const { products } = await fetchProducts()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans tracking-tight">
      {/* Top Banner (Conversion) */}
      <div className="bg-amber-400 py-3 text-center text-[11px] font-black uppercase tracking-widest text-[#1a1a1a]">
        💥 FLASH SALE: 20% OFF ALL COLLECTIONS — USE CODE: <span className="underline select-all cursor-pointer">MEDUSA22</span>
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-xl z-50 rounded-b-3xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-black text-blue-600 flex items-center gap-2">
           CONVEX <span className="bg-slate-900 text-white px-2 py-0.5 rounded-lg text-xs tracking-tighter">STORE / C</span>
        </h1>
        <div className="flex gap-4">
          <button className="bg-slate-100 p-2.5 rounded-2xl hover:bg-slate-200 transition-colors">🔍</button>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 transition-all">
            CART (0)
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 mt-10">
        {/* Featured Hero Section */}
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 overflow-hidden relative mb-24 min-h-[400px] flex items-center">
           <div className="relative z-10 max-w-xl">
              <span className="text-blue-400 font-black tracking-widest text-xs uppercase mb-4 block">New Season Drop</span>
              <h2 className="text-6xl font-black text-white leading-tight mb-8">
                 Revolutionize your <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">shopping experience.</span>
              </h2>
              <button className="bg-blue-600 text-white px-10 py-5 rounded-3xl text-sm font-black uppercase tracking-[0.1em] shadow-2xl shadow-blue-500/40 hover:bg-blue-500 transition-all">
                 Shop the Collection
              </button>
           </div>
           {/* Abstract Decoration */}
           <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-32" />
        </div>

        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-3xl font-black">All Products</h3>
            <p className="text-slate-400 mt-2 font-medium">Browse our full inventory with ease.</p>
          </div>
          <select className="bg-white px-6 py-2 rounded-2xl border border-slate-200 text-xs font-bold uppercase tracking-widest outline-none focus:border-blue-500 shadow-sm cursor-pointer">
            <option>Featured First</option>
            <option>Latest</option>
            <option>Price: Low-High</option>
          </select>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product: any) => (
            <div key={product.id} className="bg-white rounded-[2rem] p-4 border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group flex flex-col h-full shadow-sm">
              <div className="aspect-square bg-slate-50 relative overflow-hidden mb-5 rounded-[1.5rem] flex items-center justify-center">
                 <Image 
                    src={product.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000"} 
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-all duration-500 ease-in-out"
                 />
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-900 border border-slate-100">
                    🔥 Trending
                 </div>
              </div>
              
              <div className="flex flex-col flex-1 px-1">
                <h3 className="text-sm font-black text-slate-800 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">{product.title}</h3>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-900">
                    {product.variants?.[0]?.prices?.[0]?.amount 
                      ? `₹ ${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                      : "Out of Stock"}
                  </span>
                  <button className="bg-slate-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black hover:bg-blue-600 transition-colors shadow-lg">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="bg-white py-32 px-6 border-t border-slate-100 mt-40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-2">
             <h4 className="text-2xl font-black text-blue-600 mb-6">CONVEX</h4>
             <p className="text-slate-400 font-medium max-w-sm mb-10 leading-relaxed">
                The high-performance storefront solution for the next generation of e-commerce SaaS platforms. Built on Medusa.js.
             </p>
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors">I</div>
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors">T</div>
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors">F</div>
             </div>
          </div>
          <div className="space-y-6">
             <h5 className="text-[10px] uppercase tracking-widest font-black text-slate-900">Shop</h5>
             <div className="flex flex-col gap-3 text-sm font-bold text-slate-500">
                <a href="#">Best Sellers</a>
                <a href="#">New Arrivals</a>
                <a href="#">Sales</a>
             </div>
          </div>
          <div className="space-y-6">
             <h5 className="text-[10px] uppercase tracking-widest font-black text-slate-900">Support</h5>
             <div className="flex flex-col gap-3 text-sm font-bold text-slate-500">
                <a href="#">Shipping</a>
                <a href="#">Returns</a>
                <a href="#">Contact</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
