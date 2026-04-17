"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
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

  const generateWhatsAppLink = () => {
    const items = cart?.items?.map((item: any) => 
      `* ${item.title} (x${item.quantity}) - AED ${(item.unit_price * item.quantity / 100).toLocaleString()}`
    ).join("\n")
    
    const total = `Total: AED ${(cart?.total / 100).toLocaleString()}`
    const text = encodeURIComponent(`Hi Chocolayt, I'd like to place an order:\n\n${items}\n\n${total}`)
    return `https://wa.me/+971553924347?text=${text}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
           <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    )
  }

  const isEmpty = !cart?.items || cart.items.length === 0

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <header className="mb-12">
           <h1 className="text-4xl font-black tracking-tight text-foreground italic uppercase">Your Box</h1>
           <p className="text-secondary-text font-medium mt-2">Check your items before placing the wholesale order.</p>
        </header>

        {isEmpty ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border border-gray-100 shadow-sm">
             <div className="text-6xl mb-6">📦</div>
             <h2 className="text-xl font-black text-foreground mb-4 uppercase">Your box is empty</h2>
             <p className="text-secondary-text mb-10 max-w-xs mx-auto">Looks like you haven't added any premium snacks yet.</p>
             <Link href="/" className="bg-primary text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                Start Shopping
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Item List */}
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
               {cart.items.map((item: any, i: number) => (
                 <div key={item.id} className={`p-6 md:p-8 flex items-center gap-6 md:gap-8 ${i !== cart.items.length - 1 ? 'border-b border-gray-50' : ''} ${updating === item.id ? 'opacity-50' : ''}`}>
                    <div className="w-20 md:w-32 aspect-square bg-gray-50 rounded-2xl relative flex-shrink-0 overflow-hidden border border-gray-100">
                       <Image src={item.thumbnail} alt={item.title} fill className="object-contain p-2" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-1 mb-1">{item.title}</h3>
                       <p className="text-xs text-secondary-text mb-4">AED {(item.unit_price / 100).toLocaleString()} / unit</p>
                       
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                             <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors font-bold"
                             >−</button>
                             <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                             <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors font-bold"
                             >+</button>
                          </div>
                          
                          <button 
                             onClick={() => handleDeleteItem(item.id)}
                             className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 px-3 py-1.5"
                          >Remove</button>
                       </div>
                    </div>
                    
                    <div className="hidden md:block text-right">
                       <p className="text-lg font-black text-foreground">AED {(item.unit_price * item.quantity / 100).toLocaleString()}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Order Summary */}
            <div className="bg-foreground text-white rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[120px] opacity-10 -mr-32 -mt-32"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-2">
                     <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Grand Total (Incl. Taxes)</p>
                     <p className="text-4xl md:text-5xl font-black italic tracking-tighter">AED {(cart.total / 100).toLocaleString()}</p>
                     <p className="text-primary text-[10px] font-black uppercase tracking-widest">+ Free Delivery across UAE</p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                     <Link 
                       href="/checkout"
                       className="bg-primary hover:bg-primary-hover text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/30 text-center inline-block"
                     >
                        Proceed to Checkout
                     </Link>
                     <Link href="/" className="text-center text-xs font-bold text-gray-400 hover:text-white transition-colors">
                        ← Continue Shopping
                     </Link>
                  </div>
               </div>
            </div>
          </div>
        )}

        <section className="mt-20">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-4">
             Trusted by 500+ Local Stores <div className="h-px bg-gray-100 flex-1" />
           </h4>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 grayscale">
              {/* Trust badges placeholders */}
              <div className="h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400">MARKET</div>
              <div className="h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400">HOTEL</div>
              <div className="h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400">CAFÉ</div>
              <div className="h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400">OFFICE</div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
