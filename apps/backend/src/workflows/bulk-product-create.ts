import { 
  createStep, 
  StepResponse, 
  createWorkflow, 
  WorkflowResponse 
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

// 1. Step: Bulk create products in the Product Module
const createProductsStep = createStep(
  "create-products-step",
  async (input: any[], { container }) => {
    const productModuleService = container.resolve(Modules.PRODUCT)
    const created = await productModuleService.create(input)
    return new StepResponse(created, created.map(p => p.id))
  },
  async (ids, { container }) => {
    const productModuleService = container.resolve(Modules.PRODUCT)
    await productModuleService.delete(ids)
  }
)

// 2. Workflow: Orchestrate the bulk import
export const bulkProductCreateWorkflow = createWorkflow(
  "bulk-product-create",
  (input: any[]) => {
    const products = createProductsStep(input)
    return new WorkflowResponse(products)
  }
)
