import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Minimal Store — Clean & Curated",
  description: "Discover our carefully curated collection of premium products.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#fafafa] antialiased`}>
        <header className="border-b border-slate-100 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
          <div 
             className="px-6 md:px-12 py-10 flex justify-between items-center" 
             style={{ maxWidth: '1440px', margin: '0 auto' }}
          >
            <a href="/" className="text-2xl font-black tracking-[-0.05em] uppercase">Minima.</a>
            <nav className="flex gap-16 text-[10px] uppercase font-black tracking-[0.4em] text-slate-400">
              <a href="/" className="hover:text-black transition-colors text-black border-b-2 border-black pb-2">Home</a>
              <a href="/collections/all" className="hover:text-black transition-colors">Catalog</a>
              <a href="/about" className="hover:text-black transition-colors">Archive</a>
              <a href="/cart" className="hover:text-black transition-colors">Cart (0)</a>
            </nav>
          </div>
        </header>
        
        <main className="min-h-screen">{children}</main>

        <footer className="bg-zinc-950 pt-80 pb-32 relative overflow-hidden">
          {/* GHOST BRANDING WATERMARK */}
          <div className="absolute -bottom-32 -left-12 select-none pointer-events-none opacity-[0.05] flex items-end">
             <span className="text-[38rem] font-black tracking-[-0.08em] leading-none uppercase text-zinc-800">Minima</span>
          </div>

          <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-20 mb-60">
              <div className="col-span-2">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 text-white">Minima.</h2>
                <p className="max-w-xs text-sm text-zinc-500 leading-[2.2] font-medium uppercase tracking-[0.2em]">
                  Objects for a curated lifestyle. Purposely simple. Built to last generations. Established 2026 / Manhattan Archive NYC.
                </p>
              </div>
              
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-white mb-10 border-b border-white/5 pb-3">Index / 01</h3>
                <ul className="space-y-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <li><a href="/" className="hover:text-white transition-colors">Digital Home</a></li>
                  <li><a href="/collections/all" className="hover:text-white transition-colors">The Catalog</a></li>
                  <li><a href="/about" className="hover:text-white transition-colors">Archive Notes</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Exhibitions</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-white mb-10 border-b border-white/5 pb-3">Connect</h3>
                <ul className="space-y-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pinterest</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Are.na</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-white mb-10 border-b border-white/5 pb-3">Security</h3>
                <ul className="space-y-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                </ul>
              </div>
            </div>

            {/* SYSTEM METADATA ROW (EMERALD GLOW) */}
            <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex gap-12 text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
                    <span className="text-zinc-400">System / Active</span>
                 </div>
                 <span>Coord / 40.7128° N</span>
                 <span>Archive / v1.0.4</span>
              </div>
              
              <div className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em]">
                 © 2026 Minima Archive System / All Rights Reserved.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

