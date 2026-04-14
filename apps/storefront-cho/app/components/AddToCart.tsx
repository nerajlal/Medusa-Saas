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
      className={`relative w-full py-4 overflow-hidden rounded-2xl transition-all duration-300 active:scale-[0.98] ${
        added 
          ? "bg-green-500 text-white" 
          : "bg-primary text-black hover:bg-primary-hover shadow-sm"
      }`}
    >
       <div className="flex items-center justify-center gap-3">
          {loading ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <span className="text-[14px] font-black uppercase tracking-tighter">
               {added ? "Added to Cart ✓" : "Add to cart"}
            </span>
          )}
       </div>
    </button>
  )
}
