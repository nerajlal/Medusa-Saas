import { fetchProduct, fetchProducts } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import Header from "@/app/components/Header"
import AddToCart from "@/app/components/AddToCart"
import { ChevronRight, Clock, ShieldCheck, Truck } from "lucide-react"

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await fetchProduct(handle)
  const relatedProducts = await fetchProducts({ limit: "5" })

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-2xl font-black text-gray-400">Product not found</p>
        </div>
      </div>
    )
  }

  const variant = product.variants?.[0]
  const amount = variant?.prices?.[0]?.amount || 0
  const priceStr = (amount / 100).toFixed(2)
  const [dollars, cents] = priceStr.split(".")

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex-1 w-full relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-8 w-full">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <ChevronRight className="w-3 h-3" />
           <Link href="/products" className="hover:text-primary transition-colors">Groceries</Link>
           <ChevronRight className="w-3 h-3" />
           <span className="text-foreground line-clamp-1">{product.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left: Product Images */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="aspect-square bg-white rounded-3xl border border-gray-100 overflow-hidden relative shadow-sm flex items-center justify-center p-8 lg:p-16">
              <Image 
                src={product.thumbnail || product.images?.[0]?.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000"} 
                alt={product.title || "Product Image"}
                fill
                unoptimized
                className="object-contain p-8 md:p-12"
              />
               {/* Instacart Style Badge */}
               <div className="absolute top-6 left-6 bg-primary text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full">
                  Fresh
               </div>
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto carousel-hide-scrollbar pb-2">
                {product.images.slice(0, 4).map((img: any, i: number) => (
                  <div key={i} className="min-w-[80px] aspect-square bg-white rounded-xl border border-gray-100 overflow-hidden relative cursor-pointer hover:border-primary transition-colors">
                    <Image src={img.url} alt={product.title || "Product Gallery Image"} fill unoptimized className="object-contain p-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32 space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2 leading-tight tracking-tight">
                {product.title}
              </h1>
              <p className="text-primary font-bold text-sm mb-6 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> 100% Satisfaction Guarantee</p>
              
              <div className="flex items-start text-foreground mb-8">
                <span className="text-4xl font-black">₹{dollars}</span>
                <span className="price-superscript text-xl">{cents}</span>
                <span className="ml-3 mt-2 text-sm text-gray-400 font-bold uppercase">/ 1 each</span>
              </div>

              <div className="text-gray-600 font-medium leading-relaxed mb-8 text-sm md:text-base">
                <p>{product.description || "Fresh, high-quality groceries delivered straight to your door. Raley's carefully selects every item to ensure the best for your family."}</p>
              </div>

              {variant && (
                <div className="pt-6 border-t border-gray-100">
                    <div className="w-full sm:w-2/3">
                       <AddToCart variantId={variant.id} variant="market" />
                    </div>
                </div>
              )}
            </div>

            {/* Delivery/Store Features */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                     <Clock className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="font-bold text-sm text-foreground">Delivery available</h4>
                     <p className="text-xs text-gray-500 font-medium">Get it in as little as 1 hour.</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                     <Truck className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="font-bold text-sm text-foreground">Curbside Pickup</h4>
                     <p className="text-xs text-gray-500 font-medium">Ready in 2 hours at local Raley's.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Related Products - Instacart Scroll Row style */}
        <section className="mt-24 mb-16 relative">
            <div className="flex justify-between items-center mb-6 px-1">
              <h3 className="text-2xl font-black text-foreground tracking-tight">Similar Items</h3>
              <Link href="/products" className="flex items-center gap-1 text-primary font-black text-sm hover:underline">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
           
            <div className="flex overflow-x-auto gap-5 pb-8 pt-2 carousel-hide-scrollbar -mx-4 px-4 snap-x">
              {relatedProducts.filter((p: any) => p.id !== product.id).slice(0, 6).map((rp: any) => {
                 const rpAmount = rp.variants?.[0]?.prices?.[0]?.amount || 0;
                 const rpPrice = (rpAmount / 100).toFixed(2);
                 const [rDol, rCen] = rpPrice.split(".");
                 
                 return (
                  <div key={rp.id} className="group min-w-[200px] max-w-[200px] snap-start flex flex-col relative bg-white rounded-2xl p-2 hover:instacart-shadow transition-all duration-300">
                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                        {rp.variants?.[0]?.id && (
                          <AddToCart variantId={rp.variants[0].id} variant="market" />
                        )}
                    </div>
                    <Link href={`/products/${rp.handle}`} className="relative aspect-square mb-4 block overflow-hidden rounded-xl bg-gray-50 border border-gray-100/50">
                      <Image 
                        src={rp.thumbnail || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"} 
                        alt={rp.title || "Related Product Image"} 
                        fill 
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                      />
                    </Link>
                    <div className="flex flex-col flex-1 px-2">
                        <div className="mb-1 flex items-start text-foreground">
                          <span className="text-lg font-black">₹{rDol}</span>
                          <span className="text-[10px] font-bold leading-[1.8]">{rCen}</span>
                        </div>
                        <h4 className="text-[13px] font-bold text-gray-800 leading-tight mb-1 line-clamp-2 h-8 group-hover:text-primary transition-colors">{rp.title}</h4>
                        <p className="text-[11px] text-gray-400 font-bold mb-2 uppercase tracking-tighter">1 each</p>
                    </div>
                  </div>
                 )
              })}
           </div>
        </section>
      </main>

      <footer className="bg-sidebar border-t border-border-light py-12 px-8 mt-auto w-full">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 grayscale opacity-40">
              <div className="w-8 h-8 bg-foreground rounded-lg" />
              <span className="text-xl font-black italic">Raley's</span>
            </div>
            <span className="text-xs font-bold text-gray-400">© 2026 Raley's Marketplace. All rights reserved.</span>
            <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-gray-500">
               <a href="#" className="hover:text-primary transition-colors">Privacy</a>
               <a href="#" className="hover:text-primary transition-colors">Terms</a>
               <a href="#" className="hover:text-primary transition-colors">Help</a>
            </div>
         </div>
      </footer>
    </div>
  )
}
