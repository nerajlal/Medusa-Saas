import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function copyAdminPassword({ container }: ExecArgs) {
  const authModuleService = container.resolve(Modules.AUTH);
  
  const authIdentities = await authModuleService.listAuthIdentities({}, { relations: ["provider_identities"] });
  
  // 1. Find admin hash
  const adminIdentity = authIdentities.find(i => i.entity_id === "admin@medusa-test.com");
  if (!adminIdentity || !adminIdentity.provider_identities) {
    console.error("Admin identity missing");
    return;
  }
  
  const adminEmailPass = adminIdentity.provider_identities.find(p => p.provider === "emailpass");
  const validHash = adminEmailPass?.provider_metadata?.password;
  
  if (!validHash) {
    console.error("No password hash found for admin");
    return;
  }
  
  console.log("Found valid hashed password from admin. Copying to other users...");

  // 2. Update other users
  for (const identity of authIdentities) {
    if (identity.entity_id !== "admin@medusa-test.com" && identity.provider_identities) {
      const emailpassIdentity = identity.provider_identities.find(p => p.provider === "emailpass");
      if (emailpassIdentity) {
         try {
           await authModuleService.updateProviderIdentities([{
             id: emailpassIdentity.id,
             provider_metadata: {
               password: validHash 
             }
           }]);
           console.log(`Updated password hash for ${identity.entity_id || identity.id}`);
         } catch (e) {
           console.error(`Error for ${identity.id}`, e.message);
         }
      }
    }
  }

  console.log("Password hash copying complete!");
}
