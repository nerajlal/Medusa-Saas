"use client"

import Link from "next/link"
import { useCart } from "./CartProvider"

export default function Header() {
  const { cart } = useCart()
  const itemCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0

  return (
    <>
      <div className="bg-blue-600 py-2.5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white">
        ⚡ Limited Time Only: Free Global Express Shipping on Orders Over ₹5,000 ⚡
      </div>
      
      <nav className="max-w-7xl mx-auto w-full px-6 py-4 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-2xl z-50 rounded-b-[2rem] border border-slate-200 mt-2 shadow-xl shadow-slate-200/40">
        <h1 className="text-2xl font-black text-blue-600 tracking-tighter italic">
          <Link href="/">CONVEX</Link>
        </h1>
        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <Link href="/collections/trending" className="hover:text-blue-600 transition-colors">Trending</Link>
          <Link href="/collections/all" className="hover:text-blue-600 transition-colors">Shop All</Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">Support</Link>
        </div>
        <div className="flex gap-4">
           <button className="bg-slate-100 p-2.5 rounded-2xl hover:bg-slate-200 transition-colors">🔍</button>
           <Link href="/cart" className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Cart [{itemCount}]
           </Link>
        </div>
      </nav>
    </>
  )
}
