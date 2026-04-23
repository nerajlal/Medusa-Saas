import Link from "next/link"

export default function Footer() {
  return (
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
                <Link href="#" className="hover:text-white transition-colors">Archive</Link>
                <Link href="#" className="hover:text-white transition-colors">Privé</Link>
                <Link href="#" className="hover:text-white transition-colors">Concierge</Link>
              </div>
           </div>
           <div className="flex flex-col gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Legal</span>
              <div className="flex flex-col gap-3 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                <Link href="#" className="hover:text-white transition-colors">Manifesto</Link>
              </div>
           </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center text-[9px] font-black uppercase tracking-[0.5em] text-neutral-800">
         <p>© 2026 Noir Multi-tenant. All Rights Reserved.</p>
         <div className="flex gap-10">
            <Link href="#">Instagram</Link>
            <Link href="#">Twitter</Link>
         </div>
      </div>
    </footer>
  )
}
