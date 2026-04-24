"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
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
      // 1. Update Cart with Address & Email
      await updateCart(cartId, {
        email: formData.email,
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: formData.company,
          address_1: formData.address,
          city: formData.city,
          country_code: "in", // Hardcoded to India for Raley's Market
          phone: formData.phone
        }
      })

      // 2. Fetch Shipping Options (UAE)
      const optionsRes = await fetchShippingOptions(cartId)
      const options = optionsRes.shipping_options || []
      
      if (options.length === 0) {
        throw new Error("No shipping options available for this region.")
      }
      
      // 3. Add default shipping method
      await addShippingMethod(cartId, options[0].id)
      
      // 4. Initiate Payment Session (Required by Medusa V2 to complete)
      await initiatePaymentSession(cartId)
      
      // 5. Complete Order
      const completeRes = await completeCart(cartId)
      
      if (completeRes.type === "order") {
        // Clear local storage and redirect
        localStorage.removeItem("cart_id")
        await refreshCart()
        router.push(`/order/confirmed/${completeRes.order.id}`)
      } else {
        throw new Error("Could not finalize order. " + JSON.stringify(completeRes))
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An unexpected error occurred during checkout.")
    } finally {
      setLoading(false)
    }
  }

  if (cartLoading || !cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
           <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Checkout Form */}
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tight text-foreground mb-8">Checkout</h1>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-8">
                {error}
              </div>
            )}
            
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">First Name</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Last Name</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Company Name (Optional)</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Delivery Address</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Street Address</label>
                    <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Country</label>
                    <input disabled type="text" value="United Arab Emirates (UAE)" className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 text-sm outline-none cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-foreground text-white rounded-[2rem] p-8 md:p-10 sticky top-8 shadow-2xl overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[120px] opacity-10 -mr-32 -mt-32"></div>
               
               <h2 className="text-2xl font-black italic uppercase relative z-10 mb-8">Summary</h2>
               
               <div className="space-y-4 relative z-10 mb-8 max-h-64 overflow-y-auto pr-4">
                  {cart.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-white/10 pb-4">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0 relative">
                            {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />}
                         </div>
                         <div>
                            <p className="font-bold line-clamp-1">{item.title}</p>
                            <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                         </div>
                       </div>
                       <p className="font-black">INR {(item.unit_price * item.quantity / 100).toLocaleString()}</p>
                    </div>
                  ))}
               </div>
               
               <div className="space-y-3 text-sm text-gray-400 relative z-10 pt-4 border-t border-white/10">
                  <div className="flex justify-between">
                     <p>Subtotal</p>
                     <p>INR {(cart.subtotal / 100).toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                     <p>Shipping</p>
                     <p className="text-primary font-bold">Standard Delivery</p>
                  </div>
               </div>
               
               <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end relative z-10">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total To Pay</p>
                  <p className="text-4xl text-primary font-black italic">INR {(cart.total / 100).toLocaleString()}</p>
               </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
