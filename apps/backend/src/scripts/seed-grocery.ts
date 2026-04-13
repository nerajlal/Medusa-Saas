import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow, createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows"

export default async function seedGrocery({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelId = "sc_choco_dxn23"

  logger.info("Starting grocery seeding...")

  // Create Categories or Fetch existing ones
  let freshProduceCatId = ""
  let pantryCatId = ""

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: {
      name: ["Fresh Produce", "Pantry"]
    }
  })

  const freshProduceCat = existingCategories.find(c => c.name === "Fresh Produce")
  const pantryCat = existingCategories.find(c => c.name === "Pantry")

  if (freshProduceCat) {
    freshProduceCatId = freshProduceCat.id
  } else {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: [{ name: "Fresh Produce", is_active: true }] }
    })
    freshProduceCatId = result[0].id
  }

  if (pantryCat) {
    pantryCatId = pantryCat.id
  } else {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: [{ name: "Pantry", is_active: true }] }
    })
    pantryCatId = result[0].id
  }
  
  logger.info("Categories fetched or created.")

  // Fetch a shipping profile
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "type"],
  })
  const shippingProfile = shippingProfiles.find(p => p.type === "default") || shippingProfiles[0]

  // Products data
  const productsInput = [
    {
      title: "Organic Apples (1kg)",
      category_ids: [freshProduceCatId],
      description: "Fresh, crisp organic apples directly from the farm.",
      handle: "organic-apples",
      weight: 1000,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile?.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=600",
        }
      ],
      options: [
        {
          title: "Weight",
          values: ["1kg"],
        },
      ],
      variants: [
        {
          title: "1kg",
          sku: "APPLE-ORG-1KG",
          options: { Weight: "1kg" },
          prices: [
            { currency_code: "aed", amount: 1500 }, // AED 15
            { currency_code: "usd", amount: 400 },
          ],
        },
      ],
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "Organic Bananas (1 Bunch)",
      category_ids: [freshProduceCatId],
      description: "Naturally ripened organic bananas.",
      handle: "organic-bananas",
      weight: 500,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile?.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600",
        }
      ],
      options: [
        {
          title: "Weight",
          values: ["1 Bunch"],
        },
      ],
      variants: [
        {
          title: "1 Bunch",
          sku: "BANANA-ORG-BUNCH",
          options: { Weight: "1 Bunch" },
          prices: [
            { currency_code: "aed", amount: 800 }, 
            { currency_code: "usd", amount: 200 },
          ],
        },
      ],
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "Whole Wheat Bread",
      category_ids: [pantryCatId],
      description: "Freshly baked whole wheat bread loaf.",
      handle: "whole-wheat-bread",
      weight: 400,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile?.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
        }
      ],
      options: [
        {
          title: "Size",
          values: ["Loaf"],
        },
      ],
      variants: [
        {
          title: "Loaf",
          sku: "BREAD-WW",
          options: { Size: "Loaf" },
          prices: [
            { currency_code: "aed", amount: 1000 }, 
            { currency_code: "usd", amount: 300 },
          ],
        },
      ],
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "Almond Milk (Unsweetened 1L)",
      category_ids: [pantryCatId],
      description: "Plant-based unsweetened almond milk.",
      handle: "almond-milk",
      weight: 1000,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile?.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600",
        }
      ],
      options: [
        {
          title: "Volume",
          values: ["1L"],
        },
      ],
      variants: [
        {
          title: "1L",
          sku: "ALMOND-MILK-1L",
          options: { Volume: "1L" },
          prices: [
            { currency_code: "aed", amount: 1800 }, 
            { currency_code: "usd", amount: 500 },
          ],
        },
      ],
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "Free Range Eggs (Dozen)",
      category_ids: [freshProduceCatId],
      description: "Farm-fresh free range brown eggs.",
      handle: "free-range-eggs",
      weight: 600,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile?.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600",
        }
      ],
      options: [
        {
          title: "Pack",
          values: ["Dozen"],
        },
      ],
      variants: [
        {
          title: "Dozen",
          sku: "EGGS-FR-DOZ",
          options: { Pack: "Dozen" },
          prices: [
            { currency_code: "aed", amount: 2000 }, 
            { currency_code: "usd", amount: 600 },
          ],
        },
      ],
      sales_channels: [{ id: salesChannelId }],
    }
  ]

  const { result: productsResult } = await createProductsWorkflow(container).run({
    input: {
      products: productsInput,
    },
  })

  logger.info(`Successfully created ${productsResult.length} grocery products.`)
}
