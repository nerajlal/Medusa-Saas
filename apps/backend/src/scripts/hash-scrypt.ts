import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
// We need to require scrypt-kdf which is guaranteed to be available in node_modules
import scrypt from "scrypt-kdf";

export default async function fixPasswordsWithScrypt({ container }: ExecArgs) {
  const authModuleService = container.resolve(Modules.AUTH);
  
  // 1. Generate hash for 'supersecret'
  const hashConfig = { logN: 15, r: 8, p: 1 };
  const passwordHash = await scrypt.kdf("supersecret", hashConfig);
  const base64Hash = passwordHash.toString("base64");
  
  console.log("Successfully generated scrypt hash for 'supersecret'");

  // 2. Apply to all users
  const authIdentities = await authModuleService.listAuthIdentities({}, { relations: ["provider_identities"] });
  
  for (const identity of authIdentities) {
    if (identity.provider_identities) {
      const emailpassIdentity = identity.provider_identities.find(p => p.provider === "emailpass");
      if (emailpassIdentity) {
         try {
           await authModuleService.updateProviderIdentities([{
             id: emailpassIdentity.id,
             provider_metadata: {
               password: base64Hash
             }
           }]);
           console.log(`Updated password hash for ${identity.entity_id || identity.id}`);
         } catch (e) {
           console.error(`Error for ${identity.id}`, e.message);
         }
      }
    }
  }

  console.log("Password fix complete!");
}
