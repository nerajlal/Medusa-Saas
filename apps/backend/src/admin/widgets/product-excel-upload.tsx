import { defineWidgetConfig } from "@medusajs/admin-sdk"
import React, { useState, useRef } from "react"

// ─────────────────────────────────────────────
//  Bulk Excel Product Upload Widget
//  Shown on Products list page in Medusa Admin
// ─────────────────────────────────────────────
const BulkUploadWidget = () => {
  const [file, setFile] = useState<File | null>(null)
  const [tenantId, setTenantId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected && selected.name.endsWith(".xlsx")) {
      setFile(selected)
      setResult(null)
    } else {
      alert("Please select a valid .xlsx file")
    }
  }

  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel file.")
    if (!tenantId) return alert("Please enter a Tenant ID.")

    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`/admin/bulk-upload`, {
        method: "POST",
        headers: { "x-tenant-id": tenantId },
        body: formData,
      })
      const data = await res.json()

      if (res.ok) {
        setResult({ success: true, message: data.message })
        setFile(null)
        if (fileRef.current) fileRef.current.value = ""
      } else {
        setResult({ success: false, message: data.error || "Upload failed" })
      }
    } catch (err: any) {
      setResult({ success: false, message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        borderRadius: "12px",
        padding: "24px",
        border: "1px solid rgba(79, 209, 197, 0.2)",
        fontFamily: "'Inter', sans-serif",
        color: "#e2e8f0",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px", color: "#4fd1c5" }}>
        📊 Bulk Product Import
      </h2>
      <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
        Upload an Excel (.xlsx) file to create products in bulk for a specific tenant.
        Required columns: <code>title</code>, <code>price</code>, <code>inventory</code>.
        Optional: <code>description</code>, <code>handle</code>, <code>status</code>, <code>currency</code>.
      </p>

      {/* Tenant ID Input */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "6px" }}>
          TENANT ID
        </label>
        <input
          id="bulk-upload-tenant-id"
          type="text"
          placeholder="e.g. tenant_001"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(79, 209, 197, 0.3)",
            borderRadius: "8px",
            color: "#e2e8f0",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* File Drop Zone */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${file ? "#4fd1c5" : "rgba(79, 209, 197, 0.3)"}`,
          borderRadius: "10px",
          padding: "32px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: "16px",
          background: file ? "rgba(79, 209, 197, 0.08)" : "transparent",
          transition: "all 0.2s ease",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>
          {file ? "✅" : "📁"}
        </div>
        <p style={{ margin: 0, fontSize: "14px", color: file ? "#4fd1c5" : "#64748b" }}>
          {file ? file.name : "Click to select an .xlsx file"}
        </p>
        <input
          id="bulk-upload-file"
          ref={fileRef}
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {/* Upload Button */}
      <button
        id="bulk-upload-submit"
        onClick={handleUpload}
        disabled={loading || !file || !tenantId}
        style={{
          width: "100%",
          padding: "12px",
          background: loading || !file || !tenantId
            ? "rgba(79, 209, 197, 0.3)"
            : "linear-gradient(135deg, #4fd1c5, #3182ce)",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 700,
          cursor: loading || !file || !tenantId ? "not-allowed" : "pointer",
          letterSpacing: "0.5px",
          transition: "opacity 0.2s",
        }}
      >
        {loading ? "⏳ Importing..." : "🚀 Start Import"}
      </button>

      {/* Result Message */}
      {result && (
        <div style={{
          marginTop: "16px",
          padding: "12px 16px",
          borderRadius: "8px",
          background: result.success ? "rgba(72, 187, 120, 0.15)" : "rgba(245, 101, 101, 0.15)",
          border: `1px solid ${result.success ? "#48bb78" : "#f56565"}`,
          fontSize: "13px",
          color: result.success ? "#68d391" : "#fc8181",
        }}>
          {result.success ? "✅ " : "❌ "}{result.message}
        </div>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default BulkUploadWidget
