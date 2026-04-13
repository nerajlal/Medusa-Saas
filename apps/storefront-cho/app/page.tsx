import { fetchProducts } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import AddToCart from "./components/AddToCart"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default async function Home() {
  const products = await fetchProducts()

  // Chocolayt categories
  const categories = [
    { name: "Chocolates", count: 12 },
    { name: "Jellies", count: 24 },
    { name: "Candies", count: 8 },
    { name: "Marshmallow", count: 18 },
    { name: "Wafers & Cake", count: 15 },
    { name: "Biscuits", count: 32 },
    { name: "Bubble Gum", count: 5 }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero / Banner */}
      <section className="bg-foreground text-white py-12 md:py-20 px-6 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
         <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">Premium Wholesale<br/><span className="text-primary">Snacks & Chocolates.</span></h2>
               <p className="text-gray-400 text-sm md:text-base font-medium mb-8">Direct trade, 24h delivery, and the best prices on top brands. Stock your shelves today.</p>
               <div className="flex justify-center md:justify-start gap-4">
                  <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors shadow-lg shadow-primary/30">Shop Now</button>
                  <a href="https://wa.me/+971553924347" className="md:hidden flex items-center justify-center bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-sm font-bold transition-colors">Contact</a>
               </div>
            </div>
            <div className="hidden md:block relative w-64 h-64">
               {/* Decorative Element */}
               <div className="absolute inset-0 bg-primary rounded-full blur-[80px] opacity-20"></div>
            </div>
         </div>
      </section>

      {/* Categories Bar */}
      <section className="border-b border-gray-200 bg-white sticky top-[73px] z-40 shadow-sm">
         <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
               {categories.map((cat, i) => (
                 <button key={i} className={`whitespace-nowrap px-5 py-2 rounded-full border text-sm font-semibold transition-all ${i === 0 ? 'bg-foreground text-white border-foreground' : 'bg-white text-secondary-text border-gray-200 hover:border-primary hover:text-primary shadow-sm hover:shadow-md'}`}>
                   {cat.name}
                 </button>
               ))}
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 bg-background">
        
        {/* Products Grid */}
        <section className="mb-20">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black tracking-tight text-foreground">Featured Products</h3>
              <button className="text-primary text-sm font-bold hover:underline">View All →</button>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
             {products?.map((product: any) => (
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
             ))}
           </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

