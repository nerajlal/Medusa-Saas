"use client"

import React from "react"
import Link from "next/link"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"

export default function OrderConfirmedPage({ params }: { params: { id: string } }) {
  const orderId = params.id
  const displayId = orderId.slice(-8).toUpperCase()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6 py-20">
        <div className="max-w-2xl w-full">
          <div className="bg-white p-12 md:p-20 rounded-[3rem] border border-gray-100 shadow-xl text-center relative overflow-hidden">
             
             <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-primary/30">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
               </svg>
             </div>
             
             <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4">
                Box Secured
             </h1>
             
             <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                Thank you for your wholesale order. We've received it and our team is now preparing your premium snacks for delivery.
             </p>
             
             <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-12 inline-block mx-auto min-w-[250px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Order Reference</p>
                <p className="text-2xl font-black tracking-tight text-primary">#{displayId}</p>
             </div>
             
             <div>
                <Link 
                  href="/" 
                  className="inline-block bg-foreground hover:bg-black text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-black/10"
                >
                   Return to Store
                </Link>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
