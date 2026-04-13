import React from "react"

export default function Footer() {
  const categories = [
    { name: "Chocolates" },
    { name: "Jellies" },
    { name: "Candies" },
    { name: "Marshmallow" }
  ];

  return (
    <footer className="bg-foreground text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            <div className="md:col-span-2">
               <h2 className="text-2xl font-black mb-4 text-primary">Chocolayt.</h2>
               <p className="text-gray-400 text-sm max-w-sm mb-6">Wholesale of premium chips and chocolates. Delivering happiness to stores everywhere.</p>
               <a href="https://wa.me/+971553924347" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors">
                  📱 Contact Us on Whatsapp
               </a>
            </div>
            <div>
               <h5 className="text-xs font-black uppercase tracking-widest mb-6 text-gray-500">Categories</h5>
               <ul className="flex flex-col gap-3 text-sm font-semibold text-gray-300">
                  {categories.map((c, i) => (
                     <li key={i}><a href="#" className="hover:text-primary transition-colors">{c.name}</a></li>
                  ))}
               </ul>
            </div>
            <div>
               <h5 className="text-xs font-black uppercase tracking-widest mb-6 text-gray-500">Legal</h5>
               <ul className="flex flex-col gap-3 text-sm font-semibold text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
               </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-xs text-gray-500 font-medium">
           ⚡ Store created from Google Sheets using Store.link
        </div>
    </footer>
  )
}
