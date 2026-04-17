import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function hashPasswordsViaAuthMethod({ container }: ExecArgs) {
  const authModuleService = container.resolve(Modules.AUTH);
  
  // 1. Create a dummy identity with 'supersecret'
  const dummyIdentity = await authModuleService.createAuthIdentities({
    provider: "emailpass",
    entity_id: "dummy" + Date.now() + "@test.com",
    scope: "admin",
    provider_metadata: {
      password: "supersecret"
    }
  });

  // 2. Fetch the newly created identity to get the hashed password
  const fetchedDummy = await authModuleService.listAuthIdentities(
    { id: dummyIdentity.id }, 
    { relations: ["provider_identities"] }
  );

  const validHash = fetchedDummy[0].provider_identities.find(p => p.provider === "emailpass").provider_metadata.password;

  console.log("Successfully generated proper Medusa auth hash using internal method!");

  // 3. Apply this hash to everyone else
  const allIdentities = await authModuleService.listAuthIdentities({}, { relations: ["provider_identities"] });
  for (const identity of allIdentities) {
    if (identity.provider_identities) {
      const emailpassIdentity = identity.provider_identities.find(p => p.provider === "emailpass");
      if (emailpassIdentity && identity.id !== dummyIdentity.id) {
         try {
           await authModuleService.updateProviderIdentities([{
             id: emailpassIdentity.id,
             provider_metadata: {
               password: validHash
             }
           }]);
           console.log(`Updated password hash for ${identity.entity_id}`);
         } catch (e) {
           console.error(`Error for ${identity.id}`, e.message);
         }
      }
    }
  }

  console.log("Password hash update complete!");
}
