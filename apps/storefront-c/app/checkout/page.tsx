"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/app/components/CartProvider"
import { 
  updateCart, 
  fetchShippingOptions, 
  addShippingMethod, 
  initiatePaymentSession, 
  completeCart 
} from "@/lib/medusa"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartId, refreshCart, loading: cartLoading } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  })

  useEffect(() => {
    if (!cartLoading && (!cart || !cart.items || cart.items.length === 0)) {
      router.push("/cart")
    }
  }, [cart, cartLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cartId) return

    setLoading(true)
    setError(null)
    try {
      await updateCart(cartId, {
        email: formData.email,
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: formData.company,
          address_1: formData.address,
          city: formData.city,
          country_code: "ae",
          phone: formData.phone
        }
      })

      const optionsRes = await fetchShippingOptions(cartId)
      const options = optionsRes.shipping_options || []
      
      if (options.length === 0) {
        throw new Error("No shipping options available.")
      }
      
      await addShippingMethod(cartId, options[0].id)
      await initiatePaymentSession(cartId)
      const completeRes = await completeCart(cartId)
      
      if (completeRes.type === "order") {
        localStorage.removeItem("cart_id")
        await refreshCart()
        router.push(`/order/confirmed/${completeRes.order.id}`)
      } else {
        throw new Error("Could not finalize order.")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  if (cartLoading || !cart || cart.items?.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-slate-50 text-slate-900">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 mb-10">Checkout</h1>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-6 rounded-3xl text-sm font-bold mb-8 border-2 border-red-100">
                {error}
              </div>
            )}
            
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                <h2 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">First Name</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Last Name</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Phone</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Street Address</label>
                    <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-4"
              >
                {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : "Complete Purchase"}
              </button>
            </form>
          </div>

          <div className="lg:pl-12">
            <div className="bg-slate-900 text-white rounded-[3rem] p-12 sticky top-8 shadow-3xl overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 -mr-48 -mt-48"></div>
               <h2 className="text-3xl font-black italic uppercase mb-10 tracking-tighter relative z-10">Review</h2>
               
               <div className="space-y-6 mb-10 relative z-10 max-h-96 overflow-y-auto pr-6 custom-scrollbar">
                  {cart.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-white/5 pb-6">
                       <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 relative border border-white/10">
                            {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain p-2" />}
                         </div>
                         <div>
                            <p className="font-black italic uppercase tracking-tighter text-base">{item.title}</p>
                            <p className="text-slate-400 text-xs font-bold">QTY: {item.quantity}</p>
                         </div>
                       </div>
                       <p className="font-black text-blue-400">{(item.unit_price * item.quantity / 100).toLocaleString()} AED</p>
                    </div>
                  ))}
               </div>
               
               <div className="mt-10 pt-10 border-t border-white/5 flex justify-between items-end relative z-10">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Order Total</p>
                  <p className="text-5xl font-black italic tracking-tighter text-white">{(cart.total / 100).toLocaleString()} AED</p>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
