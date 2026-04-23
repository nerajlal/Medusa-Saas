import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function debugModules({ container }: any) {
  console.log("Available Modules Keys:", Object.keys(Modules))
}
