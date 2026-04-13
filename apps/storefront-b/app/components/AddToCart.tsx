"use client"

import { useState } from "react"
import { createCart, addLineItem } from "@/lib/medusa"

export default function AddToCart({ variantId }: { variantId: string }) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      let cartId = localStorage.getItem("cart_id")
      if (!cartId) {
        const { cart } = await createCart()
        cartId = cart.id
        localStorage.setItem("cart_id", cartId!)
      }
      await addLineItem(cartId!, variantId, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (e) {
      console.error(e)
      alert("Failed to add to cart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleAddToCart}
      disabled={loading}
      className={`relative w-full py-4 overflow-hidden border border-zinc-700 transition-all duration-500 group ${
        added ? "bg-zinc-800 border-zinc-600" : "bg-transparent hover:bg-zinc-900"
      }`}
    >
       <div className={`flex items-center justify-center gap-4 transition-all duration-500 ${loading ? "opacity-30 scale-95" : "opacity-100 scale-100"}`}>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-300">
             {added ? "Acquired ✓" : "Add to Collection"}
          </span>
          <div className={`w-1 h-1 rounded-full ${added ? "bg-zinc-100" : "bg-zinc-600 group-hover:bg-zinc-200"} transition-colors`} />
       </div>
       
       {/* Animated Border Line */}
       <div className="absolute bottom-0 left-0 h-px bg-zinc-200 transition-all duration-700 w-0 group-hover:w-full" />
    </button>
  )
}
