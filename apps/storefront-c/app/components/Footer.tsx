import Link from "next/link"

export default function Footer() {
  return (
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
                <Link href="#" className="hover:text-blue-600 transition-colors">Performance Gear</Link>
                <Link href="#" className="hover:text-blue-600 transition-colors">Lifestyle Essentials</Link>
                <Link href="#" className="hover:text-blue-600 transition-colors">New Drops</Link>
             </div>
          </div>
          <div className="space-y-6">
             <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 leading-none">Company</h4>
             <div className="flex flex-col gap-4 text-sm font-bold text-slate-400">
                <Link href="#" className="hover:text-blue-600 transition-colors">About Us</Link>
                <Link href="#" className="hover:text-blue-600 transition-colors">Returns & Logistics</Link>
                <Link href="#" className="hover:text-blue-600 transition-colors">Careers</Link>
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
  )
}
