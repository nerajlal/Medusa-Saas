"use client"

import Link from "next/link"
import { Search, MapPin, ChevronDown, ShoppingCart, Zap } from "lucide-react"
import { useCart } from "./CartProvider"

export default function Header() {
  const { cart } = useCart()
  const itemCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border-light h-20 flex items-center px-4 md:px-8">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-8 shrink-0">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-white font-black text-xl">R</span>
        </div>
        <span className="hidden lg:block text-2xl font-black tracking-tight text-foreground italic">
          Raley's<span className="text-primary not-italic font-extrabold ml-0.5">Market</span>
        </span>
      </Link>

      {/* Center Controls: Toggle & Address & Search */}
      <div className="flex-1 flex items-center gap-4 max-w-5xl">
        {/* Delivery/Pickup Toggle */}
        <div className="hidden xl:flex bg-gray-100 p-1 rounded-full h-11 items-center gap-1 shrink-0">
          <button className="bg-white text-foreground px-4 h-9 rounded-full text-sm font-bold shadow-sm">Delivery</button>
          <button className="text-gray-500 px-4 h-9 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">Pickup</button>
        </div>

        {/* Address Selector */}
        <div className="hidden md:flex items-center gap-2 border-l border-gray-200 pl-4 pr-2 cursor-pointer hover:bg-gray-50 h-11 rounded-lg transition-colors shrink-0">
          <Zap className="w-5 h-5 text-primary fill-primary" />
          <div className="flex flex-col -space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Delivery to</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-foreground">95814</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search Raley's Market..." 
            className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-white border-2 border-transparent focus:border-primary rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium transition-all outline-none"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-6 shrink-0">
        <button className="hidden sm:block text-sm font-black text-foreground hover:text-primary transition-colors px-3">Sign In</button>
        <Link href="/cart" className="bg-primary text-white pl-4 pr-5 h-12 rounded-full text-sm font-black instacart-shadow hover:bg-primary-hover transition-all flex items-center gap-2.5">
          <div className="bg-white/20 p-1.5 rounded-full">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="hidden md:inline">Cart</span>
          <span className="bg-white text-primary w-6 h-6 flex items-center justify-center rounded-full text-[12px]">{itemCount}</span>
        </Link>
      </div>
    </header>
  )
}

