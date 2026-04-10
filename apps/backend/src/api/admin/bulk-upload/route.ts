import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import multer from "multer"
import ExcelJS from "exceljs"
import { Readable } from "stream"
import { bulkProductCreateWorkflow } from "../../../workflows/bulk-product-create"

// Use memory storage so files go into RAM (no disk write needed)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

// Middleware wrapper for multer in Medusa
const runMiddleware = (req: any, res: any, fn: any) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result)
      return resolve(result)
    })
  })

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // 1. Parse the uploaded file
    await runMiddleware(req, res, upload.single("file"))
    const file = (req as any).file
    if (!file) return res.status(400).json({ error: "No file uploaded" })

    // 2. Read XLSX from memory buffer
    const workbook = new ExcelJS.Workbook()
    const stream = Readable.from(file.buffer)
    await workbook.xlsx.read(stream)

    const worksheet = workbook.worksheets[0]
    const products: any[] = []

    // 3. Parse rows (skip header row 1)
    let headers: string[] = []
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell) => headers.push(String(cell.value || "").toLowerCase().replace(/\s/g, "_")))
        return
      }

      const product: Record<string, any> = {}
      row.eachCell((cell, colNumber) => {
        product[headers[colNumber - 1]] = cell.value
      })
      products.push(product)
    })

    if (!products.length) {
      return res.status(400).json({ error: "No product rows found in sheet" })
    }

    // 4. Get tenant context securely from the authenticated session
    let tenantId = req.headers["x-tenant-id"] as string

    if (!tenantId && (req as any).auth_context?.actor_id) {
       const query = req.scope.resolve("query")
       const { data: users } = await query.graph({
         entity: "user",
         fields: ["metadata"],
         filters: { id: (req as any).auth_context.actor_id }
       })
       if (users && users.length > 0 && users[0].metadata?.tenant_id) {
          tenantId = users[0].metadata.tenant_id
       }
    }

    if (!tenantId) {
       return res.status(403).json({ error: "Unauthorized: Could not determine tenant context from session." })
    }

    // 5. Prepare product data for the Workflow
    const productData = products.map((row) => ({
      title: row.title,
      description: row.description || "",
      handle: row.handle || String(row.title).toLowerCase().replace(/\s+/g, "-"),
      status: (row.status || "draft").toLowerCase(),
      metadata: { 
        tenant_id: tenantId, 
        bulk_imported: "true" 
      },
      variants: [
        {
          title: "Default",
          sku: row.sku || `SKU-${Math.random().toString(36).substring(7)}`,
          prices: [
            {
              amount: Math.round(Number(row.price || 0) * 100), // convert to cents/paise
              currency_code: (row.currency || "inr").toLowerCase(),
            },
          ],
        },
      ],
    }))

    // 6. Execute the Workflow
    const { result } = await bulkProductCreateWorkflow(req.scope).run({
      input: productData,
    })

    return res.status(200).json({
      message: `Successfully imported ${result.length} products`,
      tenant_id: tenantId,
      products: result.map((p: any) => ({ id: p.id, title: p.title })),
    })

  } catch (err: any) {
    console.error("Bulk upload error:", err)
    return res.status(500).json({ error: err.message })
  }
}

export const config = {
  api: {
    bodyParser: false, // Required for multer
  },
}
