"use client"

import React from "react"
import Link from "next/link"

export default function OrderConfirmedPage({ params }: { params: { id: string } }) {
  const orderId = params.id
  const displayId = orderId.slice(-8).toUpperCase()

  return (
    <div className="bg-slate-50 text-slate-900 min-h-[85vh] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="bg-white p-16 md:p-24 rounded-[4rem] border-2 border-slate-100 text-center relative overflow-hidden shadow-2xl shadow-slate-200">
           
           <div className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-blue-200 rotate-12">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
             </svg>
           </div>
           
           <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-none">
              Order Locked
           </h1>
           
           <p className="text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed font-medium">
              Your performance equipment has been secured. We're processing the transaction and preparing for immediate dispatch.
           </p>
           
           <div className="bg-slate-900 text-white rounded-3xl p-8 mb-16 inline-block mx-auto min-w-[320px] shadow-3xl">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Tracking Identification</p>
              <p className="text-3xl font-black italic tracking-tighter text-blue-400">#{displayId}</p>
           </div>
           
           <div>
              <Link 
                href="/" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-200"
              >
                 Return to Catalog
              </Link>
           </div>
        </div>
      </div>
    </div>
  )
}
