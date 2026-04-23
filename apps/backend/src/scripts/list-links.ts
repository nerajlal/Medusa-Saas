import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function listAllLinks({ container }: any) {
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  console.log("Defined Links Keys:", Object.keys((remoteLink as any).definitions_))
}
