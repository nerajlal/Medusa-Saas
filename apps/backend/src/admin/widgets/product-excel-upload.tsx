import { defineWidgetConfig } from "@medusajs/admin-sdk"
import React, { useState, useRef } from "react"

const BulkUploadWidget = () => {
  const [file, setFile] = useState<File | null>(null)
  const [tenantId, setTenantId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; details?: any } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected && (selected.name.endsWith(".xlsx") || selected.name.endsWith(".csv"))) {
      setFile(selected)
      setResult(null)
    } else {
      alert("Please select a valid .xlsx or .csv file")
    }
  }

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.")
    if (!tenantId) return alert("Please enter a Tenant ID context.")

    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      // In production, this would hit the backend API
      const res = await fetch(`/admin/bulk-upload`, {
        method: "POST",
        headers: { "x-tenant-id": tenantId },
        body: formData,
      })
      const data = await res.json()

      if (res.ok) {
        setResult({ success: true, message: data.message, details: data.products })
        setFile(null)
        if (fileRef.current) fileRef.current.value = ""
      } else {
        setResult({ success: false, message: data.error || "Import failed" })
      }
    } catch (err: any) {
      setResult({ success: false, message: "Network error or backend unreachable." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/10 shadow-2xl font-sans text-slate-200 mb-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="text-blue-500">⚡</span> Bulk Product Orchestrator
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">Scale your catalog across tenants in seconds.</p>
        </div>
        <div className="bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400">
          v2.0 / Multi-Tenant
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Tenant Context</label>
            <input 
              type="text" 
              placeholder="e.g. nike-main-store"
              className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-3 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono text-sm"
              value={tenantId}
              onChange={e => setTenantId(e.target.value)}
            />
          </div>
          <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> Schema Requirements
             </p>
             <ul className="text-[11px] space-y-2 text-slate-500 font-medium">
                <li className="flex justify-between"><span>Title / Handle</span> <span className="text-slate-300">Required</span></li>
                <li className="flex justify-between"><span>Price / Currency</span> <span className="text-slate-300">Required</span></li>
                <li className="flex justify-between"><span>Inventory SKU</span> <span className="text-slate-300">Optional</span></li>
             </ul>
          </div>
        </div>

        <div 
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-10 cursor-pointer transition-all ${
            file ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 hover:border-white/20'
          }`}
        >
          <div className={`text-4xl mb-4 ${file ? 'opacity-100 animate-bounce' : 'opacity-20'}`}>
            {file ? "📄" : "☁️"}
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-center">
            {file ? file.name : "Select XLSX or CSV"}
          </p>
          {!file && <p className="text-[10px] text-slate-500 mt-2 font-medium italic">Drop file to start processing</p>}
          <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      <button 
        onClick={handleUpload}
        disabled={loading || !file || !tenantId}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98]"
      >
        {loading ? "⚙️ Processing Streams..." : "🚀 Execute Bulk Import"}
      </button>

      {result && (
        <div className={`mt-8 p-6 rounded-2xl border ${result.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">{result.success ? "✅" : "❌"}</span>
            <span className="font-black uppercase tracking-widest text-xs">{result.success ? "Success" : "Error"}</span>
          </div>
          <p className="text-sm font-medium opacity-80">{result.message}</p>
          {result.details && (
             <div className="mt-4 pt-4 border-t border-emerald-500/10 max-h-32 overflow-y-auto scrollbar-hide text-[10px] font-mono grid grid-cols-2 gap-2">
                {result.details.map((p: any) => (
                  <div key={p.id} className="bg-emerald-500/5 px-2 py-1 rounded truncate">ID: {p.id}</div>
                ))}
             </div>
          )}
        </div>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default BulkUploadWidget
