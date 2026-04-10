import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function fixAuth({ container }: ExecArgs) {
  const authModuleService = container.resolve(Modules.AUTH)
  const remoteLink = container.resolve("remoteLink")
  const query = container.resolve("query")

  const emails = ["nike@test.com", "apple@test.com", "adidas@test.com"]

  for (const email of emails) {
    try {
      console.log(`Registering ${email}...`)
      // Register creates both AuthIdentity and ProviderIdentity for emailpass
      const authIdentity = await authModuleService.register("emailpass", {
        entity_id: email,
        provider_metadata: {
          password: "password"
        }
      })
      console.log(`Created AuthIdentity: ${authIdentity.id} for ${email}`)

      // Retrieve existing user
      const { data: users } = await query.graph({
        entity: "user",
        fields: ["id", "email"],
        filters: { email }
      })

      if (users && users.length > 0) {
        const userId = users[0].id
        // Link them
        await remoteLink.create([
          {
            [Modules.USER]: {
              user_id: userId,
            },
            [Modules.AUTH]: {
              auth_identity_id: authIdentity.id,
            },
          },
        ])
        console.log(`Successfully linked User ${userId} to AuthIdentity ${authIdentity.id}`)
      } else {
        console.log(`User not found for ${email}.`)
      }
    } catch (e: any) {
      console.error(`Error for ${email}: ${e.message}`)
    }
  }
}
