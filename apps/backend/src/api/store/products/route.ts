import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Custom store products route — filters by tenant_id from x-tenant-id header
// Uses Medusa v2 price tables: price + product_variant_price_set + price_set
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const tenantId = (req.headers["x-tenant-id"] as string) || ""
    const db = req.scope.resolve("__pg_connection__") as any

    if (!tenantId) {
      return res.status(400).json({ error: "x-tenant-id header is required", products: [] })
    }

    const limit = parseInt((req.query.limit as string) || "100", 10)
    const offset = parseInt((req.query.offset as string) || "0", 10)
    const handle = req.query.handle as string | undefined

    // 1. Fetch products
    let productSql = `
      SELECT p.id, p.title, p.handle, p.description, p.thumbnail, p.status, p.created_at
      FROM product p
      WHERE p.tenant_id = ?
        AND p.deleted_at IS NULL
        AND p.status = 'published'`
    const productParams: any[] = [tenantId]

    if (handle) {
      productSql += ` AND p.handle = ?`
      productParams.push(handle)
    }
    productSql += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`
    productParams.push(limit, offset)

    const productsResult = await db.raw(productSql, productParams)
    const products = productsResult.rows || []

    if (products.length > 0) {
      const productIds = products.map((p: any) => p.id)

      // 2. Variants
      const variantsResult = await db.raw(
        `SELECT pv.id, pv.title, pv.product_id, pv.sku, pv.variant_rank
         FROM product_variant pv
         WHERE pv.product_id IN (${productIds.map(() => "?").join(",")})
           AND pv.deleted_at IS NULL
         ORDER BY pv.variant_rank ASC NULLS LAST`,
        productIds
      )
      const variants = variantsResult.rows || []

      // 3. Prices via correct Medusa v2 schema
      const variantsByProduct: Record<string, any[]> = {}
      if (variants.length > 0) {
        const variantIds = variants.map((v: any) => v.id)

        const pricesResult = await db.raw(
          `SELECT pvps.variant_id, pr.amount, pr.currency_code
           FROM product_variant_price_set pvps
           JOIN price_set ps ON ps.id = pvps.price_set_id
           JOIN price pr ON pr.price_set_id = ps.id
           WHERE pvps.variant_id IN (${variantIds.map(() => "?").join(",")})
             AND pr.deleted_at IS NULL`,
          variantIds
        )

        const pricesByVariant: Record<string, any[]> = {}
        for (const p of pricesResult.rows || []) {
          if (!pricesByVariant[p.variant_id]) pricesByVariant[p.variant_id] = []
          pricesByVariant[p.variant_id].push({ amount: p.amount, currency_code: p.currency_code })
        }

        for (const v of variants) {
          if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = []
          variantsByProduct[v.product_id].push({
            id: v.id,
            title: v.title,
            sku: v.sku,
            prices: pricesByVariant[v.id] || [],
          })
        }
      }

      // 4. Fetch Categories
      const categoriesResult = await db.raw(
        `SELECT pcp.product_id, pc.id, pc.handle, pc.name
         FROM product_category_product pcp
         JOIN product_category pc ON pc.id = pcp.product_category_id
         WHERE pcp.product_id IN (${productIds.map(() => "?").join(",")})
           AND pc.deleted_at IS NULL`,
        productIds
      )

      const categoriesByProduct: Record<string, any[]> = {}
      for (const cat of categoriesResult.rows || []) {
        if (!categoriesByProduct[cat.product_id]) categoriesByProduct[cat.product_id] = []
        categoriesByProduct[cat.product_id].push({
          id: cat.id,
          handle: cat.handle,
          name: cat.name
        })
      }

      for (const product of products) {
        product.variants = variantsByProduct[product.id] || []
        product.categories = categoriesByProduct[product.id] || []
      }
    } else {
        for (const product of products) {
            product.variants = []
            product.categories = []
        }
    }

    // 5. Count
    let countSql = `SELECT COUNT(*) as count FROM product p WHERE p.tenant_id = ? AND p.deleted_at IS NULL AND p.status = 'published'`
    const countParams: any[] = [tenantId]
    if (handle) {
      countSql += ` AND p.handle = ?`
      countParams.push(handle)
    }

    const countResult = await db.raw(countSql, countParams)
    const count = parseInt(countResult.rows?.[0]?.count || "0", 10)

    return res.json({ products, count, offset, limit })
  } catch (err: any) {
    console.error("[Store Products] Error:", err.message)
    return res.status(500).json({ error: err.message, products: [] })
  }
}
