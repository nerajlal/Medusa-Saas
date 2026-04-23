"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/app/components/CartProvider"
import { deleteLineItem, updateLineItem } from "@/lib/medusa"

export default function CartPage() {
  const { cart, cartId, refreshCart, loading } = useCart()
  const [updating, setUpdating] = useState<string | null>(null)

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setUpdating(itemId)
    try {
      await updateLineItem(cartId!, itemId, newQuantity)
      await refreshCart()
    } catch (e) {
      console.error(e)
    } finally {
      setUpdating(null)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    setUpdating(itemId)
    try {
      await deleteLineItem(cartId!, itemId)
      await refreshCart()
    } catch (e) {
      console.error(e)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
         <div className="w-8 h-8 border-4 border-neutral-800 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  const isEmpty = !cart?.items || cart.items.length === 0

  return (
    <div className="bg-[#0a0a0a] text-white">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <header className="mb-12 border-b border-neutral-900 pb-8">
           <h1 className="text-4xl font-light tracking-tight text-white uppercase">Your Collection</h1>
           <p className="text-neutral-500 font-medium mt-2">Review your selection before finalizing.</p>
        </header>

        {isEmpty ? (
          <div className="bg-neutral-950 rounded-2xl p-20 text-center border border-neutral-900">
             <div className="text-6xl mb-6 grayscale">📦</div>
             <h2 className="text-xl font-bold text-white mb-4 uppercase">Archive is empty</h2>
             <p className="text-neutral-500 mb-10 max-w-xs mx-auto">You haven't added any items to your collection yet.</p>
             <Link href="/" className="bg-white text-black px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">
                Begin Exploration
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-neutral-950 rounded-2xl border border-neutral-900 overflow-hidden">
               {cart.items.map((item: any, i: number) => (
                 <div key={item.id} className={`p-6 md:p-8 flex items-center gap-6 md:gap-8 ${i !== cart.items.length - 1 ? 'border-b border-neutral-900' : ''} ${updating === item.id ? 'opacity-50' : ''}`}>
                    <div className="w-20 md:w-32 aspect-square bg-neutral-900 rounded-lg relative flex-shrink-0 overflow-hidden border border-neutral-800">
                       <Image src={item.thumbnail} alt={item.title} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <h3 className="text-sm md:text-base font-bold text-white line-clamp-1 mb-1 uppercase tracking-tight">{item.title}</h3>
                       <p className="text-xs text-neutral-500 mb-4">{(item.unit_price / 100).toLocaleString()} AED</p>
                       
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-neutral-900 rounded-lg p-1">
                             <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-neutral-800 rounded transition-colors"
                             >−</button>
                             <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                             <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-neutral-800 rounded transition-colors"
                             >+</button>
                          </div>
                          
                          <button 
                             onClick={() => handleDeleteItem(item.id)}
                             className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white"
                          >Remove</button>
                       </div>
                    </div>
                    
                    <div className="hidden md:block text-right">
                       <p className="text-lg font-bold text-white">{(item.unit_price * item.quantity / 100).toLocaleString()} AED</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="bg-white text-black rounded-2xl p-8 md:p-12 shadow-2xl">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-2">
                     <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">Total Value</p>
                     <p className="text-4xl md:text-5xl font-light tracking-tighter">{(cart.total / 100).toLocaleString()} AED</p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                     <Link 
                       href="/checkout"
                       className="bg-black hover:bg-neutral-800 text-white px-10 py-5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all text-center"
                     >
                        Finalize Collection
                     </Link>
                     <Link href="/" className="text-center text-xs font-bold text-neutral-500 hover:text-black transition-colors">
                        ← Continue Exploration
                     </Link>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
