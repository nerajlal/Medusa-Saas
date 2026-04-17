import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Custom admin products GET — filters by authenticated user's tenant_id directly in SQL
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  console.log(`[DEBUG] Custom Admin Products route hit! Query: ${JSON.stringify(req.query)}`)
  try {
    const db = req.scope.resolve("__pg_connection__") as any
    const authContext = (req as any).auth_context

    // Resolve tenant from DB
    let tenantId: string | null = null
    if (authContext?.app_metadata?.user_id) {
      const userResult = await db.raw(
        `SELECT metadata FROM "user" WHERE id = ?`,
        [authContext.app_metadata.user_id]
      )
      tenantId = userResult.rows?.[0]?.metadata?.tenant_id || null
    }

    if (!tenantId) {
      // Return empty rather than error — admin dashboard should still load
      return res.json({ products: [], count: 0, offset: 0, limit: 20 })
    }

    const limit = parseInt((req.query.limit as string) || "20", 10)
    const offset = parseInt((req.query.offset as string) || "0", 10)

    const productsResult = await db.raw(
      `SELECT p.id, p.title, p.handle, p.thumbnail, p.status, p.is_giftcard,
              p.created_at, p.updated_at, p.tenant_id
       FROM product p
       WHERE p.tenant_id = ? AND p.deleted_at IS NULL
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [tenantId, limit, offset]
    )
    const products = productsResult.rows || []

    // Attach variants
    if (products.length > 0) {
      const productIds = products.map((p: any) => p.id)
      const variantsResult = await db.raw(
        `SELECT pv.id, pv.title, pv.product_id, pv.sku
         FROM product_variant pv
         WHERE pv.product_id IN (${productIds.map(() => "?").join(",")}) AND pv.deleted_at IS NULL`,
        productIds
      )
      const variantsByProduct: Record<string, any[]> = {}
      for (const v of variantsResult.rows || []) {
        if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = []
        variantsByProduct[v.product_id].push({ id: v.id, title: v.title, sku: v.sku })
      }
      for (const p of products) p.variants = variantsByProduct[p.id] || []
    }

    const countResult = await db.raw(
      `SELECT COUNT(*) as count FROM product p WHERE p.tenant_id = ? AND p.deleted_at IS NULL`,
      [tenantId]
    )
    const count = parseInt(countResult.rows?.[0]?.count || "0", 10)

    return res.json({ products, count, offset, limit })
  } catch (err: any) {
    console.error("[Admin Products GET] Error:", err.message)
    return res.status(500).json({ error: err.message })
  }
}

// Product creation — inject tenant_id after workflow run
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const db = req.scope.resolve("__pg_connection__") as any
    const authContext = (req as any).auth_context

    let tenantId: string | null = null
    if (authContext?.app_metadata?.user_id) {
      const userResult = await db.raw(
        `SELECT metadata FROM "user" WHERE id = ?`,
        [authContext.app_metadata.user_id]
      )
      tenantId = userResult.rows?.[0]?.metadata?.tenant_id || null
    }

    if (!tenantId) {
      return res.status(403).json({ message: "Could not resolve tenant for user" })
    }

    const { createProductsWorkflow } = await import("@medusajs/medusa/core-flows")
    const workflow = createProductsWorkflow(req.scope as any)
    const body = req.body as any

    const result = await workflow.run({ input: { products: [body] } })
    const createdProduct = result.result?.[0]

    if (createdProduct?.id) {
      await db.raw(`UPDATE product SET tenant_id = ? WHERE id = ?`, [tenantId, createdProduct.id])
      createdProduct.tenant_id = tenantId
    }

    return res.status(200).json({ product: createdProduct })
  } catch (err: any) {
    console.error("[Admin Products POST] Error:", err.message)
    return res.status(500).json({ error: err.message })
  }
}
