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
         <div className="w-8 h-8 border-4 border-neutral-800 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] text-white">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            <h1 className="text-4xl font-light uppercase tracking-tight text-white mb-8">Checkout</h1>
            
            {error && (
              <div className="bg-red-950/30 text-red-400 p-4 rounded-xl text-sm font-bold mb-8 border border-red-900/50">
                {error}
              </div>
            )}
            
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="bg-neutral-950 p-8 rounded-2xl border border-neutral-900 shadow-sm">
                <h2 className="text-xl font-bold mb-6 uppercase tracking-tight">Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">First Name</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Last Name</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white outline-none transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white outline-none transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Phone</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white outline-none transition-colors" />
                  </div>
                </div>
              </div>

              <div className="bg-neutral-950 p-8 rounded-2xl border border-neutral-900 shadow-sm">
                <h2 className="text-xl font-bold mb-6 uppercase tracking-tight">Shipping</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Address</label>
                    <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white outline-none transition-colors" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white hover:bg-neutral-200 text-black py-5 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3"
              >
                {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Complete Transaction"}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-neutral-950 text-white rounded-2xl p-8 md:p-10 sticky top-8 border border-neutral-900">
               <h2 className="text-2xl font-light uppercase mb-8">Summary</h2>
               
               <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-4">
                  {cart.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-neutral-900 pb-4">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-neutral-900 rounded overflow-hidden flex-shrink-0 relative">
                            {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover grayscale" />}
                         </div>
                         <div>
                            <p className="font-bold line-clamp-1 uppercase text-xs">{item.title}</p>
                            <p className="text-neutral-500 text-[10px]">QTY: {item.quantity}</p>
                         </div>
                       </div>
                       <p className="font-mono">{(item.unit_price * item.quantity / 100).toLocaleString()} AED</p>
                    </div>
                  ))}
               </div>
               
               <div className="mt-8 pt-6 border-t border-neutral-900 flex justify-between items-end">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Total</p>
                  <p className="text-4xl font-light">{(cart.total / 100).toLocaleString()} AED</p>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
