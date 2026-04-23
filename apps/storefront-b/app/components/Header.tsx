"use client"

import Link from "next/link"
import { useCart } from "./CartProvider"

export default function Header() {
  const { cart } = useCart()
  const itemCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0

  return (
    <nav className="max-w-screen-2xl mx-auto w-full px-10 py-10 flex justify-between items-center border-b border-white/5 backdrop-blur-xl sticky top-0 z-50 bg-[#0a0a0a]/80">
      <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">
        <Link href="/collections/all" className="hover:text-white transition-all">Collections</Link>
        <Link href="/about" className="hover:text-white transition-all">Bespeak</Link>
      </div>
      <h1 className="text-2xl font-black tracking-[0.3em] uppercase bg-gradient-to-r from-neutral-200 via-neutral-500 to-neutral-200 bg-clip-text text-transparent">
         <Link href="/">NOIR</Link>
      </h1>
      <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">
        <Link href="/cart" className="hover:text-white transition-all text-neutral-200 underline decoration-neutral-800 underline-offset-8">
          Cart / {itemCount}
        </Link>
      </div>
    </nav>
  )
}
