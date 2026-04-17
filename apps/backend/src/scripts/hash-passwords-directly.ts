import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import bcrypt from "bcrypt";

export default async function hashPasswordsDirectly({ container }: ExecArgs) {
  const authModuleService = container.resolve(Modules.AUTH);
  
  const authIdentities = await authModuleService.listAuthIdentities({}, { relations: ["provider_identities"] });
  
  // Create a proper bcrypt hash for 'supersecret'
  const hashedPassword = bcrypt.hashSync("supersecret", 10);
  console.log("Generated hash for 'supersecret'");

  for (const identity of authIdentities) {
    if (identity.provider_identities) {
      const emailpassIdentity = identity.provider_identities.find(p => p.provider === "emailpass");
      if (emailpassIdentity) {
         try {
           await authModuleService.updateProviderIdentities([{
             id: emailpassIdentity.id,
             provider_metadata: {
               password: hashedPassword
             }
           }]);
           console.log(`Updated password hash for ${identity.entity_id || identity.id}`);
         } catch (e) {
           console.error(`Error for ${identity.id}`, e.message);
         }
      }
    }
  }

  console.log("Password hash overwrite complete!");
}
