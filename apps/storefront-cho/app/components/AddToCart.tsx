"use client"

import { useState } from "react"
import { createCart, addLineItem } from "@/lib/medusa"
import { useCart } from "./CartProvider"

export default function AddToCart({ 
  variantId, 
  variant = "default" 
}: { 
  variantId: string, 
  variant?: "default" | "choco" 
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

  const isChoco = variant === "choco"

  return (
    <button 
      onClick={handleAddToCart}
      disabled={loading}
      className={`relative w-full py-4 overflow-hidden rounded-full transition-all duration-300 transform active:scale-95 ${
        added 
          ? "bg-emerald-500 scale-105" 
          : isChoco 
            ? "bg-primary hover:bg-primary-hover text-foreground hover:shadow-xl font-black" 
            : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white"
      }`}
    >
       <div className="flex items-center justify-center gap-3">
          {loading ? (
            <div className={`w-4 h-4 border-2 rounded-full animate-spin ${
              isChoco ? "border-foreground/30 border-t-foreground" : "border-white/30 border-t-white"
            }`} />
          ) : (
            <span className="text-[12px] font-black uppercase tracking-tighter">
               {added ? "READY IN CART ✓" : "ADD TO BOX"}
            </span>
          )}
       </div>
       
       {!added && !loading && !isChoco && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full m-3 animate-pulse" />
       )}
    </button>
  )
}
