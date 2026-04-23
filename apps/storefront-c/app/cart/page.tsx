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
         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isEmpty = !cart?.items || cart.items.length === 0

  return (
    <div className="bg-slate-50 text-slate-900">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <header className="mb-12">
           <h1 className="text-5xl font-black italic tracking-tighter text-slate-900 uppercase">Training Bag</h1>
           <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest">Ready for the next session.</p>
        </header>

        {isEmpty ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-slate-100">
             <div className="text-6xl mb-6">👟</div>
             <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase italic">Your bag is empty</h2>
             <p className="text-slate-500 mb-10 max-w-xs mx-auto font-medium">Equip yourself with the latest performance gear.</p>
             <Link href="/" className="bg-blue-600 text-white px-10 py-5 rounded-full text-sm font-black uppercase tracking-tighter hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                Shop Performance
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
               {cart.items.map((item: any) => (
                 <div key={item.id} className={`bg-white p-6 rounded-3xl flex items-center gap-6 border-2 border-slate-100 hover:border-blue-200 transition-colors ${updating === item.id ? 'opacity-50' : ''}`}>
                    <div className="w-24 h-24 bg-slate-50 rounded-2xl relative flex-shrink-0 overflow-hidden border border-slate-100">
                       <Image src={item.thumbnail} alt={item.title} fill className="object-contain p-2" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <h3 className="text-lg font-black text-slate-900 line-clamp-1 mb-1 uppercase italic tracking-tighter">{item.title}</h3>
                       <p className="text-sm font-bold text-blue-600 mb-4">{(item.unit_price / 100).toLocaleString()} AED</p>
                       
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
                             <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className="text-lg font-black text-slate-400 hover:text-slate-900"
                             >−</button>
                             <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                             <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="text-lg font-black text-slate-400 hover:text-slate-900"
                             >+</button>
                          </div>
                          
                          <button 
                             onClick={() => handleDeleteItem(item.id)}
                             className="text-xs font-black uppercase tracking-tighter text-slate-300 hover:text-red-500 transition-colors"
                          >Remove</button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border-2 border-slate-100 shadow-sm h-fit sticky top-8">
               <h2 className="text-2xl font-black italic uppercase mb-8 tracking-tighter">Summary</h2>
               
               <div className="space-y-4 mb-10 border-b border-slate-50 pb-8 text-sm font-bold text-slate-500">
                  <div className="flex justify-between">
                     <span>Subtotal</span>
                     <span className="text-slate-900">{(cart.subtotal / 100).toLocaleString()} AED</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Shipping</span>
                     <span className="text-blue-600">Calculated at next step</span>
                  </div>
               </div>
               
               <div className="flex justify-between items-end mb-10">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total</span>
                  <span className="text-4xl font-black italic tracking-tighter text-slate-900">{(cart.total / 100).toLocaleString()} AED</span>
               </div>
               
               <Link 
                 href="/checkout"
                 className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-2xl text-sm font-black uppercase tracking-widest transition-all text-center block shadow-2xl shadow-slate-200"
               >
                  Checkout Now
               </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
