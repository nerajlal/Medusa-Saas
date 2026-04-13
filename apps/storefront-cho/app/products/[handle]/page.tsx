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
  const price = variant?.prices?.[0]?.amount 
    ? `AED ${(variant.prices[0].amount / 100).toLocaleString()}` 
    : "Out of Stock"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left: Product Images */}
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-[2rem] border border-gray-100 overflow-hidden relative shadow-sm">
              <Image 
                src={product.thumbnail || product.images?.[0]?.url || "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000"} 
                alt={product.title}
                fill
                className="object-contain p-8 md:p-12 hover:scale-105 transition-transform duration-700 font-sans"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((img: any, i: number) => (
                  <div key={i} className="aspect-square bg-white rounded-xl border border-gray-100 overflow-hidden relative hover:border-primary transition-colors cursor-pointer shadow-sm">
                    <Image src={img.url} alt={product.title} fill className="object-contain p-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="sticky top-32 space-y-8">
            <div>
              <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary-text mb-6">
                 <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                 <span>/</span>
                 {product.collection && (
                   <>
                    <Link href={`/collections/${product.collection.handle}`} className="hover:text-primary transition-colors">{product.collection.title}</Link>
                    <span>/</span>
                   </>
                 )}
                 <span className="text-gray-400">Products</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4 uppercase leading-none italic">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-black text-foreground">{price}</span>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full border border-green-200">
                  In Stock (24h Delivery)
                </span>
              </div>

              <div className="prose prose-sm text-secondary-text font-medium leading-relaxed max-w-none mb-10">
                <p>{product.description || "Premium imported product curated for quality and taste. Perfect for retail or hospitality business looking for high-end snacks."}</p>
              </div>

              {variant && (
                <div className="space-y-6 border-t border-gray-100 pt-8">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                       <AddToCart variantId={variant.id} variant="choco" />
                    </div>
                    <a href={`https://wa.me/+971553924347?text=Hi, I'm interested in ${product.title}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-colors border border-green-200">
                      Bulk Inquiry
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Product Details Table */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 font-sans">Specifications</h3>
               <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <span className="text-gray-400">SKU:</span>
                  <span className="font-bold text-foreground">{variant?.sku || "N/A"}</span>
                  <span className="text-gray-400">Weight:</span>
                  <span className="font-bold text-foreground">{variant?.weight ? `${variant.weight}g` : "N/A"}</span>
                  <span className="text-gray-400">Material:</span>
                  <span className="font-bold text-foreground">{product.material || "Food Grade"}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-32">
           <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black tracking-tight text-foreground italic uppercase">You Might Also Like</h2>
              <div className="h-px bg-gray-100 flex-1 mx-8 hidden md:block"></div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.filter((p: any) => p.id !== product.id).slice(0, 4).map((rp: any) => (
                <Link key={rp.id} href={`/products/${rp.handle}`} className="group space-y-4">
                   <div className="aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden relative group-hover:border-primary transition-all">
                      <Image 
                        src={rp.thumbnail || "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000"} 
                        alt={rp.title} 
                        fill 
                        className="object-contain p-4 group-hover:scale-105 transition-transform" 
                      />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{rp.title}</h4>
                      <p className="text-xs font-medium text-secondary-text">
                        {rp.variants?.[0]?.prices?.[0]?.amount 
                          ? `AED ${(rp.variants[0].prices[0].amount / 100).toLocaleString()}` 
                          : "Stock Soon"}
                      </p>
                   </div>
                </Link>
              ))}
           </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
