import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function updatePasswords({ container }: ExecArgs) {
  const authModuleService = container.resolve(Modules.AUTH);
  
  const authIdentities = await authModuleService.listAuthIdentities({});

  for (const identity of authIdentities) {
    if (identity.entity_id !== "admin@medusa-test.com") {
      try {
        await authModuleService.updateAuthIdentities({
          id: identity.id,
          provider_metadata: {
            password: "supersecret",
          },
        });
        console.log(`Updated password for ${identity.entity_id}`);
      } catch (e) {
        console.error(`Failed to update password for ${identity.entity_id}:`, e);
      }
    }
  }

  console.log("Password update complete!");
}
