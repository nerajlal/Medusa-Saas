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
      <body className="min-h-full bg-[#0a0a0a] text-white flex flex-col selection:bg-neutral-800">
        <nav className="max-w-screen-2xl mx-auto w-full px-10 py-10 flex justify-between items-center border-b border-white/5 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">
            <a href="/collections/premium" className="hover:text-white transition-all">Collections</a>
            <a href="/about" className="hover:text-white transition-all">Bespeak</a>
          </div>
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase bg-gradient-to-r from-neutral-200 via-neutral-500 to-neutral-200 bg-clip-text text-transparent">
             <a href="/">NOIR</a>
          </h1>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">
            <a href="/cart" className="hover:text-white transition-all text-neutral-200 underline decoration-neutral-800 underline-offset-8">Cart / 0</a>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="bg-[#050505] border-t border-white/5 pt-40 pb-20 px-10">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between gap-32 mb-40">
            <div className="max-w-md">
               <h4 className="text-4xl font-black tracking-tighter text-neutral-800 uppercase mb-8">Noir / Private</h4>
               <p className="text-sm text-neutral-500 font-medium tracking-wide leading-relaxed uppercase">
                 Defining the boundaries between craftsmanship and art. Exclusive access to limited collections for the discerning few.
               </p>
            </div>
            <div className="flex gap-32">
               <div className="flex flex-col gap-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Navigation</span>
                  <div className="flex flex-col gap-3 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                    <a href="#" className="hover:text-white transition-colors">Archive</a>
                    <a href="#" className="hover:text-white transition-colors">Privé</a>
                    <a href="#" className="hover:text-white transition-colors">Concierge</a>
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Legal</span>
                  <div className="flex flex-col gap-3 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Manifesto</a>
                  </div>
               </div>
            </div>
          </div>
          <div className="max-w-screen-2xl mx-auto flex justify-between items-center text-[9px] font-black uppercase tracking-[0.5em] text-neutral-800">
             <p>© 2026 Noir Multi-tenant. All Rights Reserved.</p>
             <div className="flex gap-10">
                <a href="#">Instagram</a>
                <a href="#">Twitter</a>
             </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

