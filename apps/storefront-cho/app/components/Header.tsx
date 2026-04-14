"use client"

import React from "react"
import Link from "next/link"
import { useCart } from "./CartProvider"

export default function Header() {
  const { cart } = useCart()
  const itemCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0

  return (
    <div className="w-full">
      {/* Announcement Bar */}
      <div className="bg-primary text-foreground py-2 text-center text-[11px] font-black uppercase tracking-widest shadow-sm">
         🚀 Free Delivery on Bulk Orders & Wholesale Prices Available!
      </div>
      
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter">
              Chocolayt<span className="text-primary">.</span>
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl relative group">
             <input 
               type="text" 
               placeholder="What are you looking for today?" 
               className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-full py-3 pl-12 pr-6 text-sm font-medium transition-all outline-none"
             />
             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-lg">🔍</span>
          </div>

          <div className="flex gap-4 items-center shrink-0">
             <a href="https://wa.me/+971553924347" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 text-foreground hover:bg-primary px-4 py-2 rounded-full text-xs font-black transition-all border border-gray-200">
               WhatsApp
             </a>
             
             <Link href="/cart" className="flex items-center gap-2 hover:bg-gray-50 px-4 py-2 rounded-full transition-all relative border border-gray-200">
                <span className="text-xl">🛒</span>
                <span className="hidden md:inline text-xs font-black uppercase tracking-wider">Cart</span>
                <span className="bg-primary text-black text-[10px] font-black min-w-5 h-5 flex items-center justify-center rounded-full shadow-sm ml-1">
                  {itemCount}
                </span>
             </Link>
          </div>
        </div>
      </header>
    </div>
  )
}
