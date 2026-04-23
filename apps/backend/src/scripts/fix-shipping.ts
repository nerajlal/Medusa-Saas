import { Modules } from "@medusajs/framework/utils"

export default async function fixShipping({ container }: any) {
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const regionModule = container.resolve(Modules.REGION)

  const regions = await regionModule.listRegions({})
  console.log(`Found ${regions.length} regions.`)

  for (const region of regions) {
    console.log(`Processing region: ${region.name} (${region.id})`)
    
    // 1. Create a fulfillment set if needed
    // 2. Create a shipping option
    // Actually, in v2 this is via workflows, but we can try the direct modules if available
    
    try {
      // Just ensure the region has at least one country
      if (!region.countries || region.countries.length === 0) {
        await regionModule.updateRegions(region.id, {
          countries: ["ae", "us", "in"]
        })
        console.log(`  Added countries to ${region.name}`)
      }
    } catch (e) {
      console.error(`  Error updating region ${region.id}: ${e.message}`)
    }
  }
}
