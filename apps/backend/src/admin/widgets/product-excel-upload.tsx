import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { 
  Button, 
  Container, 
  Heading, 
  Text, 
  Label, 
  Badge, 
  StatusBadge,
  Callout,
  Select
} from "@medusajs/ui"
import React, { useState, useRef, useEffect } from "react"

const BulkUploadWidget = () => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; details?: any } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected && (selected.name.endsWith(".xlsx") || selected.name.endsWith(".csv"))) {
      setFile(selected)
      setResult(null)
    }
  }

  const downloadTemplate = () => {
    const csvContent = "handle,title,subtitle,description,status,thumbnail,price,currency_code,sku,inventory_quantity\n" +
                       "nike-zoom-x,Nike ZoomX,Superfast Running Shoe,Elite performance foam.,published,https://images.com/shoe.jpg,180,USD,NK-ZX-001,100"
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "medusa_bulk_product_template.csv")
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleUpload = async () => {
    if (!file) return 
    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`/admin/bulk-upload`, {
        method: "POST",
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
    <Container className="p-0 overflow-hidden mb-8 border border-ui-border-base shadow-elevation-card-rest">
      <div className="p-6 border-b border-ui-border-base flex items-center justify-between bg-[rgba(249,250,251,1)]">
        <div className="flex items-center gap-x-3">
          <div className="bg-white p-2 rounded-lg border border-ui-border-base shadow-sm">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-ui-fg-subtle">
              <path d="M10 3.33334V16.6667M10 3.33334L4.16667 9.16667M10 3.33334L15.8333 9.16667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <Heading level="h2">Bulk Product Orchestrator</Heading>
            <Text size="small" className="text-ui-fg-muted font-medium">Native Cross-Tenant Sync Engine</Text>
          </div>
        </div>
        <Badge color="blue" variant="outline" className="font-mono text-[10px]">MT-CORE V2.13</Badge>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Isolated Store Context */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-x-3">
              <div className="mt-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-600">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                 <Text size="small" className="font-bold text-blue-900 leading-tight">Secure Multi-Tenant Environment</Text>
                 <Text size="xsmall" className="text-blue-800/80 mt-1">Your products will be strictly synced to your assigned storefront. Any modifications automatically sync to your channels.</Text>
              </div>
            </div>

            <div className="bg-ui-bg-subtle p-4 rounded-xl border border-ui-border-base">
              <div className="flex items-center gap-x-2 mb-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-500">
                  <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <Text size="xsmall" className="font-bold uppercase tracking-tight text-ui-fg-subtle">Integration Rules</Text>
              </div>
              <ul className="text-[11px] space-y-1 text-ui-fg-muted pl-6 list-disc">
                <li>Handle-based unique mapping enabled</li>
                <li>Price injection into store currency</li>
                <li>Public image URL support required</li>
              </ul>
            </div>

            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-x-2 h-10" 
              onClick={downloadTemplate}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download Sample Format (XLSX/CSV)
            </Button>
          </div>

          <div 
            onClick={() => fileRef.current?.click()}
            className={`
              border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer h-full min-h-[220px]
              ${file ? 'border-ui-border-strong bg-ui-bg-subtle bg-[rgba(59,130,246,0.05)]' : 'border-ui-border-base hover:bg-ui-bg-subtle/50'}
            `}
          >
            <div className={`mb-4 w-12 h-12 flex items-center justify-center rounded-full ${file ? 'bg-blue-600 text-white shadow-lg' : 'bg-ui-bg-component text-ui-fg-muted'}`}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <Heading level="h3" className="text-center">{file ? file.name : "Select catalog file"}</Heading>
            <Text size="small" className="text-ui-fg-muted text-center mt-1">
              {file ? "File processed successfully" : "Click here to browse your files"}
            </Text>
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        <div className="pt-6 border-t border-ui-border-base flex items-center justify-end gap-x-3">
          {file && (
             <Button variant="secondary" onClick={() => { setFile(null); if(fileRef.current) fileRef.current.value=""; }}>
                Discard File
             </Button>
          )}
          <Button 
             className="min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white"
             disabled={loading || !file}
             onClick={handleUpload}
             isLoading={loading}
          >
             🚀 Bulk Sync Products
          </Button>
        </div>

        {result && (
          <div className="mt-6">
             <div className={`p-4 rounded-xl border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-x-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${result.success ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {result.success ? "✓" : "!"}
                   </div>
                   <div>
                      <Heading level="h3" className={result.success ? 'text-green-800' : 'text-red-800'}>
                         {result.success ? 'Import Job Successful' : 'Import Job Error'}
                      </Heading>
                      <Text size="small" className={result.success ? 'text-green-700' : 'text-red-700'}>{result.message}</Text>
                   </div>
                </div>
                {result.details && result.success && (
                   <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-green-200">
                      {result.details.slice(0, 5).map((p: any) => (
                        <StatusBadge key={p.id} color="green" className="text-[10px]">SUCCESS: {p.id}</StatusBadge>
                      ))}
                      {result.details.length > 5 && <Text size="xsmall" className="text-green-600 font-medium">+{result.details.length - 5} items</Text>}
                   </div>
                )}
             </div>
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default BulkUploadWidget
