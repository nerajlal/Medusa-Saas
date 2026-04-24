"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { fetchCart, createCart } from "@/lib/medusa"

interface CartContextType {
  cart: any
  cartId: string | null
  refreshCart: () => Promise<void>
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any>(null)
  const [cartId, setCartId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshCart = useCallback(async () => {
    let currentId = localStorage.getItem("cart_id")
    
    if (!currentId) {
      try {
        const { cart: newCart } = await createCart()
        currentId = newCart.id
        localStorage.setItem("cart_id", currentId!)
      } catch (e) {
        console.error("Failed to initialize cart:", e)
        setLoading(false)
        return
      }
    }

    setCartId(currentId)

    try {
      const cartData = await fetchCart(currentId!)
      setCart(cartData)
    } catch (e) {
      console.error("Failed to fetch cart:", e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  return (
    <CartContext.Provider value={{ cart, cartId, refreshCart, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
