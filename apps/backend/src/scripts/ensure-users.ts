import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { createUsersWorkflow } from "@medusajs/core-flows";
import scrypt from "scrypt-kdf";

export default async function ensureUsers({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  const authModuleService = container.resolve(Modules.AUTH);
  const remoteLink = container.resolve("remoteLink");
  
  // 1. Get stores
  const { rows: stores } = await pgConnection.raw("SELECT tenant_id, store_name, admin_email FROM store_settings WHERE deleted_at IS NULL AND admin_email IS NOT NULL");
  
  // 2. Hash password manually 
  const hashConfig = { logN: 15, r: 8, p: 1 };
  const passwordHash = await scrypt.kdf("supersecret", hashConfig);
  const base64Hash = passwordHash.toString("base64");

  for (const store of stores) {
    const { tenant_id, store_name, admin_email } = store;

    // Check if AuthIdentity exists
    let authIdentity;
    try {
      authIdentity = await authModuleService.retrieveAuthIdentity(admin_email);
      
      // Update password hash if it exists
      const emailpassIdentity = authIdentity.provider_identities?.find(p => p.provider === "emailpass");
      if (emailpassIdentity) {
         await authModuleService.updateProviderIdentities([{
             id: emailpassIdentity.id,
             provider_metadata: { password: base64Hash }
         }]);
         console.log(`Updated existing auth identity for: ${admin_email}`);
      } else {
         // Identity lacks emailpass provider, add it
         await authModuleService.createProviderIdentities([{
           auth_identity_id: authIdentity.id,
           provider: "emailpass",
           provider_metadata: { password: base64Hash }
         }]);
         console.log(`Added emailpass provider to existing identity for: ${admin_email}`);
      }
    } catch (e) {
      if (e.message.includes("not found")) {
        // Create full user and identity
        try {
          const { result: users } = await createUsersWorkflow(container).run({
             input: {
               users: [{
                 email: admin_email,
                 first_name: store_name,
                 last_name: "Owner",
                 metadata: { tenant_id, role: "tenant_admin" }
               }]
             }
          });
          const userId = users[0].id;
          
          authIdentity = await authModuleService.createAuthIdentities({
            provider: "emailpass",
            entity_id: admin_email,
            scope: "admin",
            provider_metadata: { password: base64Hash },
            app_metadata: { tenant_id }
          });

          await remoteLink.create([{
            [Modules.USER]: { user_id: userId },
            [Modules.AUTH]: { auth_identity_id: authIdentity.id }
          }]);
          
          console.log(`Created new User and Auth Identity for: ${admin_email}`);
        } catch (innerE) {
          console.error(`Failed to create user for ${admin_email}:`, innerE.message);
        }
      } else {
        // Just retrieve by query if retrieve() threw something else
        try {
           const users = await authModuleService.listAuthIdentities({ provider: "emailpass" }, { relations: ["provider_identities"] });
           const found = users.find(u => u.entity_id === admin_email || u.id === `authid_${admin_email.split('@')[0]}`);
           if (found) {
                const empi = found.provider_identities?.find(p => p.provider === "emailpass");
                if (empi) {
                    await authModuleService.updateProviderIdentities([{
                       id: empi.id,
                       provider_metadata: { password: base64Hash }
                    }]);
                    console.log(`Updated via search: ${admin_email}`);
                }
           }
        } catch(ee) {}
      }
    }
  }

  console.log("Sync complete!");
}
