import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import bcrypt from "bcrypt"; // medusa might use bcrypt

export default async function updatePasswordsV2({ container }: ExecArgs) {
  const authModuleService = container.resolve(Modules.AUTH);
  
  const authIdentities = await authModuleService.listAuthIdentities({});
  
  // Try to use auth module's update
  for (const identity of authIdentities) {
    if (identity.entity_id !== "admin@medusa-test.com" && identity.provider_identities) {
      const emailpassIdentity = identity.provider_identities.find(p => p.provider === "emailpass");
      if (emailpassIdentity) {
         try {
           const { result } = await authModuleService.updateProviderIdentities([{
             id: emailpassIdentity.id,
             provider_metadata: {
               password: "supersecret" // In v2, emailpass auth provider service hooks into updateProviderIdentities to hash this
             }
           }]);
           console.log(`Updated via provider identity: ${identity.entity_id || identity.id}`);
         } catch (e) {
           console.error(`Error for ${identity.id}`, e.message);
         }
      }
    }
  }

  console.log("Password update complete!");
}
