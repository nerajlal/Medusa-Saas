import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import multer from "multer"
import ExcelJS from "exceljs"
import { Readable } from "stream"

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
    const headers: string[] = []
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

    // 4. Get tenant context
    const tenantId = req.headers["x-tenant-id"] as string
    const productService = req.scope.resolve("productService" as any) as any

    // 5. Create products (batch)
    const created = []
    for (const row of products) {
      if (!row.title) continue
      const product = await productService.create({
        title: row.title,
        description: row.description || "",
        handle: row.handle || String(row.title).toLowerCase().replace(/\s+/g, "-"),
        status: row.status || "draft",
        metadata: { tenant_id: tenantId, bulk_imported: true },
        variants: [
          {
            title: "Default",
            prices: [{
              amount: Number(row.price || 0) * 100, // to lowest unit
              currency_code: row.currency || "inr",
            }],
            inventory_quantity: Number(row.inventory || 0),
          },
        ],
      })
      created.push(product)
    }

    return res.status(200).json({
      message: `Successfully imported ${created.length} products`,
      tenant_id: tenantId,
      count: created.length,
    })
  } catch (err: any) {
    console.error("Bulk upload error:", err)
    return res.status(500).json({ error: err.message })
  }
}

export const config = {
  bodyParser: false, // Required for multer
}
