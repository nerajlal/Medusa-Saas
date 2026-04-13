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
      className={`relative w-full py-4 overflow-hidden rounded-full transition-all duration-300 transform active:scale-95 ${
        added ? "bg-emerald-500 scale-105" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
      }`}
    >
       <div className="flex items-center justify-center gap-3">
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="text-[12px] font-black uppercase tracking-tighter text-white">
               {added ? "READY IN CART ✓" : "GET IT NOW"}
            </span>
          )}
       </div>
       
       {!added && !loading && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full m-3 animate-pulse" />
       )}
    </button>
  )
}
