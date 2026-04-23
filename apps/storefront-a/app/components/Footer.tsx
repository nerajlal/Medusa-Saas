import Link from "next/link"

export default function Footer() {
  return (
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
              <li><Link href="/" className="hover:text-white transition-colors">Digital Home</Link></li>
              <li><Link href="/collections/all" className="hover:text-white transition-colors">The Catalog</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Archive Notes</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Exhibitions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-white mb-10 border-b border-white/5 pb-3">Connect</h3>
            <ul className="space-y-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <li><Link href="#" className="hover:text-white transition-colors">Instagram</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pinterest</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Are.na</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-white mb-10 border-b border-white/5 pb-3">Security</h3>
            <ul className="space-y-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Returns</Link></li>
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
  )
}
