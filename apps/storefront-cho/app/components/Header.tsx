"use client"

import React from "react"
import Link from "next/link"
import { useCart } from "./CartProvider"

export default function Header() {
  const { cart } = useCart()
  const itemCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight">Chocolayt.</h1>
          <span className="hidden md:inline-block px-2 py-1 bg-gray-100 text-secondary-text text-[10px] font-bold uppercase rounded-md ml-2 border border-gray-200">Wholesale</span>
        </Link>
        <div className="flex gap-4 items-center">
           <a href="https://wa.me/+971553924347" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2 rounded-full text-xs font-bold transition-colors border border-green-200">
             <span className="text-lg">💬</span> WhatsApp Order
           </a>
           <button className="text-xl p-2 hover:bg-gray-100 rounded-full transition-colors">🔍</button>
           <Link href="/cart" className="text-xl p-2 hover:bg-gray-100 rounded-full transition-colors relative">
             🛒 <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
               {itemCount}
             </span>
           </Link>
        </div>
      </div>
    </header>
  )
}
