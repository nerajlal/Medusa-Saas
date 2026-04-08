"use client"

import { useState, useEffect } from "react"

export default function Home() {
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    tenant_id: "",
    store_name: "",
    theme: "A",
    phonepe_merchant_id: "",
    phonepe_api_key: "",
    storefront_url: ""
  })

  // Fetch tenants on load
  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = async () => {
    try {
      const res = await fetch("http://localhost:9000/admin/tenants")
      if (!res.ok) throw new Error("not ok")
      const data = await res.json()
      setTenants(data.tenants || [])
    } catch (e) {
      console.warn("Using mock tenants for demo")
      setTenants([
        {
          id: "t_1",
          tenant_id: "nike-shop",
          store_name: "Nike Official Store",
          theme: "A",
          storefront_url: "localhost:3001",
          phonepe_merchant_id: "MERCH_NIKE_001",
          phonepe_env: "production"
        },
        {
          id: "t_2",
          tenant_id: "apple-premium",
          store_name: "Apple Premium Reseller",
          theme: "B",
          storefront_url: "localhost:3002",
          phonepe_merchant_id: "MERCH_APL_99",
          phonepe_env: "sandbox"
        },
        {
          id: "t_3",
          tenant_id: "adidas-boost",
          store_name: "Adidas High-Conv",
          theme: "C",
          storefront_url: "localhost:3003",
          phonepe_merchant_id: "MERCH_ADI_07",
          phonepe_env: "production"
        }
      ])
    } finally {
      setLoading(false)
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:9000/admin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setShowModal(false)
        fetchTenants()
        setFormData({
          tenant_id: "",
          store_name: "",
          theme: "A",
          phonepe_merchant_id: "",
          phonepe_api_key: "",
          storefront_url: ""
        })
      }
    } catch (e) {
      alert("Failed to create tenant")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Medusa <span className="text-blue-600">SaaS</span></h1>
          <p className="text-slate-500 mt-1">Multi-Tenant Management Console</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200"
        >
          + Add New Store
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400">Loading tenants...</div>
        ) : tenants.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center text-slate-500">
            No stores created yet.
          </div>
        ) : (
          tenants.map((tenant) => (
            <div key={tenant.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  tenant.theme === "A" ? "bg-green-100 text-green-700" :
                  tenant.theme === "B" ? "bg-purple-100 text-purple-700" :
                  "bg-orange-100 text-orange-700"
                }`}>
                  Theme {tenant.theme}
                </span>
                <span className="text-xs text-slate-400 font-mono">{tenant.tenant_id}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{tenant.store_name}</h2>
              <div className="space-y-2 mt-4 text-sm text-slate-600">
                <p><span className="font-medium text-slate-400 uppercase text-[10px] mr-2">URL:</span> {tenant.storefront_url || "not set"}</p>
                <p><span className="font-medium text-slate-400 uppercase text-[10px] mr-2">PhonePe:</span> {tenant.phonepe_merchant_id ? `Active (${tenant.phonepe_env})` : "Not Configured"}</p>
              </div>
              <div className="mt-6 flex gap-2">
                <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-xl text-sm font-medium transition-colors">Manage</button>
                <a 
                  href={tenant.storefront_url} 
                  target="_blank" 
                  className="px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-xl text-sm font-medium flex items-center justify-center transition-colors"
                >
                  ↗
                </a>
              </div>
            </div>
          ))
        )}
      </main>

      {/* New Tenant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 overflow-hidden">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Setup New Store</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tenant Unique ID</label>
                <input 
                  required
                  placeholder="e.g. nike-shop"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.tenant_id}
                  onChange={e => setFormData({...formData, tenant_id: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Store Name</label>
                <input 
                  required
                  placeholder="e.g. Nike Official Store"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.store_name}
                  onChange={e => setFormData({...formData, store_name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Theme</label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.theme}
                    onChange={e => setFormData({...formData, theme: e.target.value})}
                  >
                    <option value="A">Plan A (Minimal)</option>
                    <option value="B">Plan B (Premium)</option>
                    <option value="C">Plan C (High Conv)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Store URL</label>
                  <input 
                    placeholder="localhost:3001"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.storefront_url}
                    onChange={e => setFormData({...formData, storefront_url: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">PhonePe Integration</p>
                <div className="space-y-3">
                  <input 
                    placeholder="Merchant ID"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    value={formData.phonepe_merchant_id}
                    onChange={e => setFormData({...formData, phonepe_merchant_id: e.target.value})}
                  />
                  <input 
                    type="password"
                    placeholder="API Key"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    value={formData.phonepe_api_key}
                    onChange={e => setFormData({...formData, phonepe_api_key: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Create Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
