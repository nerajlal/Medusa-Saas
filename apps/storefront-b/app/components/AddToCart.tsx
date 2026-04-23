"use client"

import { useState } from "react"
import { createCart, addLineItem } from "@/lib/medusa"
import { useCart } from "./CartProvider"

export default function AddToCart({ 
  variantId, 
  variant = "default" 
}: { 
  variantId: string, 
  variant?: "default" | "choco" | "minimal" | "market"
}) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const { refreshCart } = useCart()

  const handleAddToCart = async (retry = true) => {
    setLoading(true)
    try {
      let cartId = localStorage.getItem("cart_id")
      if (!cartId) {
        const { cart } = await createCart()
        cartId = cart.id
        localStorage.setItem("cart_id", cartId!)
      }
      await addLineItem(cartId!, variantId, 1)
      await refreshCart()
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (e) {
      console.error(e)
      if (retry) {
        localStorage.removeItem("cart_id")
        await handleAddToCart(false)
      } else {
        alert("Failed to add to cart")
      }
    } finally {
      if (retry) setLoading(false)
    }
  }

  const isMinimal = variant === "minimal"
  const isMarket = variant === "market"

  return (
    <button 
      onClick={handleAddToCart}
      disabled={loading}
      className={`relative w-full py-4 px-6 overflow-hidden transition-all duration-300 active:scale-[0.98] ${
        added 
          ? "bg-green-600 text-white" 
          : isMinimal 
            ? "bg-black text-white hover:bg-neutral-800"
            : isMarket
              ? "bg-[#242529] text-white hover:bg-black rounded-xl"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
      } ${isMinimal ? "" : "rounded-2xl"}`}
    >
       <div className="flex items-center justify-center gap-3">
          {loading ? (
            <div className={`w-4 h-4 border-2 rounded-full animate-spin ${ (isMinimal || added || isMarket) ? "border-white/30 border-t-white" : "border-white/30 border-t-white"}`} />
          ) : (
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
               {added ? "Added ✓" : isMinimal ? "Acquire" : isMarket ? "Add" : "Add to cart"}
            </span>
          )}
       </div>
    </button>
  )
}
