import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100">
        <div className="bg-blue-600 py-2.5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white">
          ⚡ Limited Time Only: Free Global Express Shipping on Orders Over ₹5,000 ⚡
        </div>
        
        <nav className="max-w-7xl mx-auto w-full px-6 py-4 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-2xl z-50 rounded-b-[2rem] border border-slate-200 mt-2 shadow-xl shadow-slate-200/40">
          <h1 className="text-2xl font-black text-blue-600 tracking-tighter italic">
            <a href="/">CONVEX</a>
          </h1>
          <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <a href="/collections/trending" className="hover:text-blue-600 transition-colors">Trending</a>
            <a href="/collections/all" className="hover:text-blue-600 transition-colors">Shop All</a>
            <a href="/about" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
          <div className="flex gap-4">
             <button className="bg-slate-100 p-2.5 rounded-2xl hover:bg-slate-200 transition-colors">🔍</button>
             <a href="/cart" className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                Cart [0]
             </a>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="bg-white border-t border-slate-100 mt-32 py-32 px-6 rounded-t-[4rem]">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
              <div className="col-span-1 md:col-span-2">
                 <h2 className="text-3xl font-black text-blue-600 mb-6 italic">CONVEX</h2>
                 <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-sm mb-10">
                   Providing cutting-edge e-commerce experiences with the highest performance themes.
                 </p>
                 <div className="flex gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer">IG</span>
                    <span className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer">TW</span>
                    <span className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer">FB</span>
                 </div>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 leading-none">Shop Category</h4>
                 <div className="flex flex-col gap-4 text-sm font-bold text-slate-400">
                    <a href="#" className="hover:text-blue-600 transition-colors">Performance Gear</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Lifestyle Essentials</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">New Drops</a>
                 </div>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 leading-none">Company</h4>
                 <div className="flex flex-col gap-4 text-sm font-bold text-slate-400">
                    <a href="#" className="hover:text-blue-600 transition-colors">About Us</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Returns & Logistics</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Careers</a>
                 </div>
              </div>
           </div>
           
           <div className="max-w-7xl mx-auto pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">© 2026 Convex Storefront Engine. Built on Medusa.js.</p>
              <div className="flex gap-10 items-center grayscale opacity-30">
                 <span className="text-[9px] font-black uppercase tracking-widest italic text-slate-900 border border-slate-900 px-2 h-4">Visa</span>
                 <span className="text-[9px] font-black uppercase tracking-widest italic text-slate-900 border border-slate-900 px-2 h-4">Master</span>
                 <span className="text-[9px] font-black uppercase tracking-widest italic text-slate-900 border border-slate-900 px-2 h-4">Amex</span>
              </div>
           </div>
        </footer>
      </body>
    </html>
  );
}

