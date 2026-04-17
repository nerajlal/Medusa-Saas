import Link from "next/link"
import { ShoppingBag, Repeat, List, LayoutGrid, Carrot, Sandwich, Candy } from "lucide-react"

export default function Sidebar({ categories, selectedCategory }: { categories: any[], selectedCategory?: string }) {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block h-[calc(100vh-80px)] overflow-y-auto sticky top-20 bg-sidebar border-r border-border-light">
      <div className="p-4 space-y-1">
        {/* Main Nav */}
        <Link 
          href="/" 
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-bold text-sm ${!selectedCategory ? 'bg-white text-primary shadow-sm' : 'text-foreground hover:bg-gray-200'}`}
        >
          <ShoppingBag className={`w-5 h-5 ${!selectedCategory ? 'text-primary' : 'text-gray-500'}`} />
          Shop
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-foreground hover:bg-gray-200 transition-all font-bold text-sm">
          <Repeat className="w-5 h-5 text-gray-500" />
          Buy it again
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-foreground hover:bg-gray-200 transition-all font-bold text-sm">
          <List className="w-5 h-5 text-gray-500" />
          Lists
        </button>

        <div className="my-4 border-t border-gray-200 mx-2" />

        {/* Categories Section */}
        <div className="px-4 py-2">
          <h2 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Browse Aisles</h2>
          <nav className="space-y-0.5 -mx-2">
            <Link 
              href="/" 
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-bold text-sm ${!selectedCategory ? 'text-primary' : 'text-foreground hover:bg-gray-200'}`}
            >
              <LayoutGrid className="w-5 h-5 text-gray-400" />
              All Departments
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/?category=${cat.handle}`}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-bold text-sm ${selectedCategory === cat.handle ? 'text-primary bg-white shadow-sm' : 'text-foreground hover:bg-gray-200'}`}
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {cat.handle === "fresh-produce" ? <Carrot className="w-5 h-5 text-orange-500" /> : 
                   cat.handle === "pantry" ? <Sandwich className="w-5 h-5 text-amber-700" /> : 
                   cat.handle === "chocolates" ? <Candy className="w-5 h-5 text-pink-500" /> : "🛍️"}
                </div>
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}

