"use client"

import React from "react"
import Link from "next/link"

export default function OrderConfirmedPage({ params }: { params: { id: string } }) {
  const orderId = params.id
  const displayId = orderId.slice(-8).toUpperCase()

  return (
    <div className="bg-[#0a0a0a] text-white min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-neutral-950 p-12 md:p-20 rounded-2xl border border-neutral-900 text-center relative overflow-hidden">
           
           <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-10">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
             </svg>
           </div>
           
           <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase mb-4">
              Confirmed
           </h1>
           
           <p className="text-neutral-500 mb-8 max-w-md mx-auto leading-relaxed">
              Your selection has been archived and is being prepared for transit.
           </p>
           
           <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-12 inline-block mx-auto min-w-[250px]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Reference</p>
              <p className="text-2xl font-mono text-white">#{displayId}</p>
           </div>
           
           <div>
              <Link 
                href="/" 
                className="inline-block bg-white hover:bg-neutral-200 text-black px-10 py-5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                 Return to Gallery
              </Link>
           </div>
        </div>
      </div>
    </div>
  )
}
