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
        <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
            <a href="/" className="text-lg font-black tracking-tighter uppercase">Minima</a>
            <nav className="flex gap-10 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
              <a href="/" className="hover:text-black transition-colors text-black">Home</a>
              <a href="/collections/all" className="hover:text-black transition-colors">Catalog</a>
              <a href="/about" className="hover:text-black transition-colors">Archive</a>
              <a href="/cart" className="hover:text-black transition-colors underline decoration-slate-200 underline-offset-4">Cart (0)</a>
            </nav>
          </div>
        </header>
        
        <main className="min-h-[80vh]">{children}</main>

        <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-4">Minima</h2>
              <p className="max-w-xs text-sm text-slate-400 leading-relaxed font-medium">
                Objects for a curated lifestyle. Purposely simple. Built to last generations.
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">Explore</h3>
              <ul className="space-y-4 text-xs font-bold text-slate-400">
                <li><a href="/" className="hover:text-black">New Arrivals</a></li>
                <li><a href="/collections/all" className="hover:text-black">All Collections</a></li>
                <li><a href="/about" className="hover:text-black">Our Philosophy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">Social</h3>
              <ul className="space-y-4 text-xs font-bold text-slate-400">
                <li><a href="#" className="hover:text-black">Instagram</a></li>
                <li><a href="#" className="hover:text-black">Pinterest</a></li>
                <li><a href="#" className="hover:text-black">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-8 pt-8 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <p>© 2026 Minima Multi-tenant</p>
            <div className="flex gap-8">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

