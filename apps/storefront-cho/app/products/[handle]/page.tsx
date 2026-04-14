import { fetchProduct, fetchProducts } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import AddToCart from "@/app/components/AddToCart"

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await fetchProduct(handle)
  const relatedProducts = await fetchProducts({ limit: "5" })

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Product not found</p>
      </div>
    )
  }

  const variant = product.variants?.[0]
  const aedPrice = variant?.prices?.find((p: any) => p.currency_code === "aed")
  const price = aedPrice 
    ? `AED ${(aedPrice.amount / 100).toLocaleString()}` 
    : "Out of Stock"

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left: Product Images */}
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-[3rem] border-2 border-gray-50 overflow-hidden relative shadow-sm">
              <Image 
                src={product.thumbnail || product.images?.[0]?.url || "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000"} 
                alt={product.title}
                fill
                unoptimized
                className="object-contain p-8 md:p-20 hover:scale-105 transition-transform duration-700"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((img: any, i: number) => (
                  <div key={i} className="aspect-square bg-gray-50 rounded-2xl border border-transparent overflow-hidden relative hover:border-primary transition-all cursor-pointer shadow-sm">
                    <Image src={img.url} alt={product.title} fill unoptimized className="object-contain p-3" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="sticky top-40 space-y-8">
            <div>
              <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
                 <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                 <span>/</span>
                 <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                 <span>/</span>
                 <span className="text-black">{product.title}</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black mb-6 uppercase leading-[0.9] italic">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-6 mb-10">
                <span className="text-4xl font-black text-black">{price}</span>
                <span className="px-4 py-2 bg-primary text-black text-[10px] font-black uppercase rounded-full shadow-sm">
                  Wholesale Stocked
                </span>
              </div>

              <div className="text-gray-600 font-medium leading-relaxed max-w-lg mb-12 text-sm md:text-base">
                <p>{product.description || "Premium wholesale product curated for quality and taste. Perfect for retail or hospitality business looking for high-end snacks and treats."}</p>
              </div>

              {variant && (
                <div className="space-y-6 pt-10 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                       <AddToCart variantId={variant.id} variant="choco" />
                    </div>
                    <a href={`https://wa.me/+971553924347?text=Hi, I'm interested in wholesale order for ${product.title}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-black text-white px-10 py-5 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all hover:bg-gray-800 shadow-xl shadow-black/10">
                       Bulk Inquiry
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Specifications Card */}
            <div className="bg-[#FFFBEB] rounded-[2rem] p-8 space-y-6 border border-primary/10">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Technical Specs</h3>
               <div className="grid grid-cols-2 gap-y-4 text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-widest">SKU:</span>
                  <span className="font-black text-black uppercase">{variant?.sku || "CH-9921"}</span>
                  <span className="text-gray-500 font-bold uppercase tracking-widest">Weight:</span>
                  <span className="font-black text-black">{variant?.weight ? `${variant.weight}g` : "Standard Wholesale"}</span>
                  <span className="text-gray-500 font-bold uppercase tracking-widest">Origin:</span>
                  <span className="font-black text-black uppercase">UAE / REGIONAL</span>
               </div>
            </div>
          </div>
        </div>

        {/* Related Products - Using New Card Style */}
        <section className="mt-40">
           <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-black tracking-tighter text-black italic uppercase">You Might Also Like</h2>
              <Link href="/products" className="text-xs font-black uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-colors">See complete catalog →</Link>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
              {relatedProducts.filter((p: any) => p.id !== product.id).slice(0, 5).map((rp: any) => (
                <div key={rp.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-yellow-100/50 transition-all duration-300 flex flex-col h-full overflow-hidden">
                   <div className="p-5 pb-0">
                      <h4 className="text-[13px] font-black text-gray-800 leading-tight line-clamp-2 h-8 group-hover:text-primary transition-colors uppercase">
                        {rp.title}
                      </h4>
                   </div>
                   <Link href={`/products/${rp.handle}`} className="flex-1 relative aspect-square flex items-center justify-center p-8">
                      <Image 
                        src={rp.thumbnail || "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000"} 
                        alt={rp.title} 
                        fill 
                        unoptimized
                        className="object-contain p-4 group-hover:scale-110 transition-transform" 
                      />
                   </Link>
                   <div className="p-5 pt-0">
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</span>
                         <span className="text-sm font-black text-black">
                           {rp.variants?.[0]?.prices?.[0]?.amount 
                             ? `AED ${(rp.variants[0].prices[0].amount / 100).toLocaleString()}` 
                             : "Stock Soon"}
                         </span>
                      </div>
                      <AddToCart variantId={rp.variants?.[0]?.id} variant="choco" />
                   </div>
                </div>
              ))}
           </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
