import { fetchProduct } from "@/lib/medusa"
import Image from "next/image"
import AddToCart from "@/app/components/AddToCart"

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await fetchProduct(handle)

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Inventory Exhausted / 404</div>
  }

  const variant = product.variants?.[0]

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="aspect-square bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
             <Image 
                src={product.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200"} 
                alt={product.title}
                fill
                className="object-contain group-hover:scale-105 transition-all duration-700"
             />
             <div className="absolute top-8 left-8 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">In Stock</div>
          </div>

          <div className="space-y-10">
             <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 block mb-6">Premium Series / {product.id.slice(0,6)}</span>
                <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-[0.9] text-slate-900 mb-6">{product.title}</h1>
                <p className="text-3xl font-black text-slate-900">
                  {variant?.prices?.[0]?.amount 
                    ? `₹${(variant.prices[0].amount / 100).toLocaleString()}` 
                    : "Coming Soon"}
                </p>
             </div>

             <p className="text-lg font-medium text-slate-400 leading-relaxed max-w-md">
                {product.description || "The intersection of elite engineering and minimalist design. Engineered for those who refuse to compromise."}
             </p>

             <div className="flex gap-6">
                <div className="flex-1">
                  {variant?.id && (
                    <AddToCart variantId={variant.id} variant="minimal" />
                  )}
                </div>
                <button className="w-16 h-16 rounded-[2rem] border-2 border-slate-100 flex items-center justify-center text-xl hover:border-blue-600 hover:text-blue-600 transition-all">
                   ♡
                </button>
             </div>

             <div className="pt-10 border-t border-slate-100 grid grid-cols-2 gap-8">
                <div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Category</span>
                   <p className="text-sm font-black text-slate-900 uppercase italic">Performance Gear</p>
                </div>
                <div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Lead Time</span>
                   <p className="text-sm font-black text-slate-900 uppercase italic">Express (24h)</p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
