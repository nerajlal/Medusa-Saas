import { fetchProducts } from "@/lib/medusa"
import Image from "next/image"
import AddToCart from "./components/AddToCart"

export default async function Home() {
  const products = await fetchProducts()

  const categories = [
    { name: "Dark", emoji: "🍫", count: 12 },
    { name: "Milk", emoji: "🥛", count: 24 },
    { name: "White", emoji: "🥥", count: 8 },
    { name: "Truffles", emoji: "💎", count: 18 },
    { name: "Gifts", emoji: "🎁", count: 15 },
    { name: "Bars", emoji: "🧱", count: 32 }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* STICKY ANNOUNCEMENT BAR */}
      <div className="bg-primary text-foreground py-3 text-center text-xs font-black uppercase tracking-[0.2em] sticky top-0 z-50">
        ✨ Free shipping on all Choco Bliss boxes today! ✨
      </div>

      <header className="py-8 px-6 max-w-7xl mx-auto flex justify-between items-center border-b border-gray-100">
        <h1 className="text-3xl font-[900] tracking-tighter">Choco<span className="text-primary italic">Bliss.</span></h1>
        <nav className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors">Shop All</a>
          <a href="#" className="hover:text-primary transition-colors">Gift Boxes</a>
          <a href="#" className="hover:text-primary transition-colors">Our Story</a>
          <a href="#" className="hover:text-primary transition-colors">Track Order</a>
        </nav>
        <div className="flex gap-6 items-center">
           <button className="text-xl">🔍</button>
           <button className="text-xl relative">
             🛒 <span className="absolute -top-2 -right-2 bg-primary text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">0</span>
           </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* HERO SECTION */}
        <section className="py-20 flex flex-col items-center text-center">
          <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] mb-8">
            Happiness in <br />
            <span className="text-primary not-italic">Every Bite.</span>
          </h2>
          <p className="max-w-xl text-secondary-text font-medium text-lg mb-12">
            Handcrafted artisan chocolates delivered fresh from our kitchen to your door. The perfect gift, or a well-deserved treat for yourself.
          </p>
          <button className="bg-foreground text-white px-12 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform">
            Build Your Box
          </button>
        </section>

        {/* CIRCULAR CATEGORY NAV */}
        <section className="mb-24 overflow-x-auto pb-8 scrollbar-hide">
           <div className="flex justify-center gap-10 min-w-max px-4">
              {categories.map((cat, i) => (
                <div key={i} className="flex flex-col items-center group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-4xl mb-4 border-2 border-transparent group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                    {cat.emoji}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                  <span className="text-[9px] text-secondary-text font-bold uppercase mt-1">{cat.count} items</span>
                </div>
              ))}
           </div>
        </section>

        {/* RECENT DROPS / PRODUCT GRID */}
        <section className="mb-32">
           <div className="flex justify-between items-end mb-12">
              <h3 className="text-4xl font-black italic tracking-tighter">The Essentials</h3>
              <a href="#" className="text-xs font-black uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-colors">See the full menu →</a>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {products?.map((product: any) => (
               <div key={product.id} className="group relative">
                 <div className="aspect-[4/5] relative rounded-3xl overflow-hidden bg-gray-50 mb-6">
                    <Image 
                      src={product.thumbnail || "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000"} 
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute top-4 left-4 bg-white px-4 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest">Limited Edition</div>
                 </div>
                 
                 <div className="px-2">
                    <div className="flex justify-between items-start mb-4">
                       <h4 className="text-sm font-black uppercase leading-tight max-w-[70%]">{product.title}</h4>
                       <span className="text-lg font-black italic">
                        {product.variants?.[0]?.prices?.[0]?.amount 
                          ? `€${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                          : "Sold Out"}
                       </span>
                    </div>
                    {product.variants?.[0]?.id && (
                      <AddToCart variantId={product.variants[0].id} variant="choco" />
                    )}
                 </div>
               </div>
             ))}
           </div>
        </section>

        {/* QUOTE SECTION */}
        <section className="py-40 border-y border-gray-100 mb-32 relative overflow-hidden">
            <div className="relative z-10 max-w-4xl mx-auto text-center">
               <span className="text-primary text-5xl mb-8 block font-serif">"</span>
               <h3 className="text-3xl md:text-5xl font-black italic leading-[1.1] mb-10 tracking-tighter">
                 Literally the best chocolate I've ever tasted. The packaging feels like a million bucks and the truffles are dangerously good.
               </h3>
               <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 mb-4 overflow-hidden relative">
                      <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100" alt="Avatar" fill className="object-cover" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest">Sarah Jenkins, <span className="text-secondary-text">Verifed Chocoholic</span></p>
               </div>
            </div>
            <div className="absolute -left-20 top-20 text-gray-50 text-[20rem] font-black -z-10 select-none">CHOCO</div>
        </section>

        {/* TRUST GRID */}
        <section className="mb-40 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Direct Trade", desc: "No middleman. Ethical beans.", icon: "🌱" },
              { title: "24H Delivery", desc: "Freshness is our obsession.", icon: "⚡" },
              { title: "Gift Ready", desc: "Eco-luxe packaging standard.", icon: "🎀" }
            ].map((item, i) => (
              <div key={i} className="p-10 border border-gray-100 rounded-[2.5rem] hover:border-primary transition-colors cursor-default">
                  <div className="text-4xl mb-6">{item.icon}</div>
                  <h4 className="text-lg font-black uppercase mb-2">{item.title}</h4>
                  <p className="text-sm font-medium text-secondary-text">{item.desc}</p>
              </div>
            ))}
        </section>
      </main>

      <footer className="bg-foreground text-white py-24 px-6 rounded-t-[4rem]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
              <div className="md:col-span-2">
                 <h2 className="text-3xl font-black italic mb-8 uppercase tracking-tighter text-primary">ChocoBliss.</h2>
                 <p className="text-gray-400 max-w-sm mb-12">Building a sweeter world, one artisan bar at a time. Join our newsletter for secret flavors.</p>
                 <div className="flex gap-4">
                    <input type="email" placeholder="Email Address" className="bg-white/10 border border-white/10 px-6 py-4 rounded-2xl flex-1 outline-none focus:border-primary" />
                    <button className="bg-primary text-foreground px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-colors">Join</button>
                 </div>
              </div>
              <div>
                 <h5 className="text-xs font-black uppercase tracking-widest mb-8 text-gray-500">Shop</h5>
                 <ul className="flex flex-col gap-4 text-sm font-bold">
                    <li><a href="#" className="hover:text-primary transition-colors">The Vault</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Tasting Boxes</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Subscriptions</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Bulk Orders</a></li>
                 </ul>
              </div>
              <div>
                 <h5 className="text-xs font-black uppercase tracking-widest mb-8 text-gray-500">Legal</h5>
                 <ul className="flex flex-col gap-4 text-sm font-bold text-gray-400">
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Refund Policy</a></li>
                    <li><a href="#">Shipping FAQ</a></li>
                    <li><a href="#">Terms of Service</a></li>
                 </ul>
              </div>
          </div>
      </footer>
    </div>
  )
}

