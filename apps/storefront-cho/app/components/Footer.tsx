import React from "react"
import Link from "next/link"

export default function Footer() {
  const categories = [
    { name: "Chocolates" },
    { name: "Jellies" },
    { name: "Candies" },
    { name: "Marshmallow" }
  ];

  return (
    <footer className="bg-foreground text-white py-20 px-6 relative overflow-hidden bg-mesh">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm">C</div>
                  <h2 className="text-xl font-black text-white">Choco<span className="text-primary">Bliss</span></h2>
               </div>
               <p className="text-gray-400 text-sm leading-relaxed">The region's leading wholesale partner for premium treats and snacks. We empower local retailers with direct trade and lightning-fast delivery.</p>
               <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 flex items-center justify-center rounded-xl transition-colors">📘</a>
                  <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 flex items-center justify-center rounded-xl transition-colors">📸</a>
                  <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 flex items-center justify-center rounded-xl transition-colors">🐦</a>
               </div>
            </div>
            
            <div>
               <h5 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-gray-500">Catalog</h5>
               <ul className="space-y-4">
                  {categories.map((c, i) => (
                     <li key={i}>
                        <Link href={`/?category=${c.name.toLowerCase()}`} className="text-sm font-semibold text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                           <span className="w-1.5 h-1.5 bg-primary rounded-full group-hover:bg-black transition-colors"></span>
                           {c.name}
                        </Link>
                     </li>
                  ))}
               </ul>
            </div>

            <div>
               <h5 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-gray-500">Quick Links</h5>
               <ul className="space-y-4">
                  <li><Link href="/" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">Contact Support</Link></li>
                  <li><Link href="/" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">Bulk Inquiries</Link></li>
                  <li><Link href="/" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">Shipping Info</Link></li>
               </ul>
            </div>

            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
               <h5 className="text-sm font-black mb-4">Stay updated.</h5>
               <p className="text-xs text-gray-400 mb-6 font-medium leading-loose">Get the latest wholesale offers and new arrivals directly in your inbox.</p>
               <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-xs font-medium outline-none focus:border-primary transition-colors"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-hover text-white p-2 rounded-lg transition-colors">
                     →
                  </button>
               </div>
            </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">© 2026 Choco Bliss Wholesale. All rights reserved.</p>
           <div className="flex gap-8 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-gray-300">Privacy</a>
              <a href="#" className="hover:text-gray-300">Terms</a>
              <a href="#" className="hover:text-gray-300">Cookies</a>
           </div>
        </div>
    </footer>
  )
}
