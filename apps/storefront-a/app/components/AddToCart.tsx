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
      className={`mt-4 w-full py-3 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
        added ? "bg-green-600 text-white" : "bg-black text-white hover:bg-slate-800"
      }`}
    >
      {loading ? "Adding..." : added ? "Added to Cart ✓" : "Add to Cart"}
    </button>
  )
}
