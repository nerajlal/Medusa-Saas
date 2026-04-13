import { fetchCollectionByHandle, fetchProducts } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import AddToCart from "@/app/components/AddToCart"

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const collection = await fetchCollectionByHandle(handle)
  const products = await fetchProducts({ collection_id: collection?.id })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <header className="mb-16">
          <div className="max-w-3xl">
             <span className="text-primary font-black uppercase tracking-widest text-[10px] mb-4 block">
               Wholesale Category / {collection?.title || "Exclusive"}
             </span>
             <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
               {collection?.title || "Premium Collection"}
             </h1>
             <p className="text-lg text-secondary-text font-medium leading-relaxed max-w-2xl">
                {collection?.description || "Explore our premium selection of imported snacks and chocolates. Bulk orders available with next-day delivery across the UAE."}
             </p>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
           {products?.length > 0 ? (
             products.map((product: any) => (
               <div key={product.id} className="group bg-card-bg rounded-2xl border border-gray-200 overflow-hidden hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">
                 <Link href={`/products/${product.handle}`} className="aspect-square relative bg-white p-4 overflow-hidden">
                    <Image 
                      src={product.thumbnail || "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000"} 
                      alt={product.title}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                 </Link>
                 
                 <div className="p-4 flex-1 flex flex-col justify-between border-t border-gray-50 bg-gray-50/50">
                    <Link href={`/products/${product.handle}`}>
                       <span className="text-[10px] font-bold text-secondary-text uppercase tracking-wider mb-1 block">
                          {product.title.split(' ')[0]}
                       </span>
                       <h4 className="text-sm font-bold text-foreground leading-snug mb-3 line-clamp-2 hover:text-primary transition-colors">{product.title}</h4>
                    </Link>
                    <div className="flex items-center justify-between mt-auto">
                       <span className="text-lg font-black text-foreground">
                        {product.variants?.[0]?.prices?.[0]?.amount 
                          ? `AED ${(product.variants[0].prices[0].amount / 100).toLocaleString()}` 
                          : "Out of Stock"}
                       </span>
                    </div>
                    {product.variants?.[0]?.id && (
                      <div className="mt-4">
                         <AddToCart variantId={product.variants[0].id} variant="choco" />
                      </div>
                    )}
                 </div>
               </div>
             ))
           ) : (
             <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-medium italic">No products found in this collection.</p>
             </div>
           )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
