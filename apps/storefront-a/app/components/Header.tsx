"use client"

import Link from "next/link"
import CartCount from "./CartCount"

export default function Header() {
  return (
    <header className="border-b border-slate-100 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
      <div 
         className="px-6 md:px-12 py-10 flex justify-between items-center" 
         style={{ maxWidth: '1440px', margin: '0 auto' }}
      >
        <Link href="/" className="text-2xl font-black tracking-[-0.05em] uppercase text-black">Minima.</Link>
        <nav className="flex gap-16 text-[10px] uppercase font-black tracking-[0.4em] text-slate-400">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Link href="/collections/all" className="hover:text-black transition-colors">Catalog</Link>
          <Link href="/about" className="hover:text-black transition-colors">Archive</Link>
          <CartCount />
        </nav>
      </div>
    </header>
  )
}
