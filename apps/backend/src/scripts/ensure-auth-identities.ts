import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import scrypt from "scrypt-kdf";

export default async function ensureAuthIdentities({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  const authModuleService = container.resolve(Modules.AUTH);
  const userModuleService = container.resolve(Modules.USER);
  const remoteLink = container.resolve("remoteLink");
  
  const { rows: stores } = await pgConnection.raw("SELECT tenant_id, store_name, admin_email FROM store_settings WHERE deleted_at IS NULL AND admin_email IS NOT NULL");
  
  const hashConfig = { logN: 15, r: 8, p: 1 };
  const passwordHash = await scrypt.kdf("supersecret", hashConfig);
  const base64Hash = passwordHash.toString("base64");

  for (const store of stores) {
    const { tenant_id, admin_email } = store;

    // 1. Check if auth identity exists
    let authIdentity;
    try {
      authIdentity = await authModuleService.retrieveAuthIdentity(admin_email);
    } catch(e) {
      if (e.message.includes("not found")) {
        authIdentity = null;
      }
    }

    if (!authIdentity) {
      console.log(`Creating missing auth identity for ${admin_email}`);
      authIdentity = await authModuleService.createAuthIdentities({
         provider: "emailpass",
         entity_id: admin_email,
         scope: "admin",
         provider_metadata: { password: base64Hash },
         app_metadata: { tenant_id }
      });
      console.log(`Created AuthIdentity: ${authIdentity.id}`);
    } else {
      console.log(`AuthIdentity already exists for ${admin_email}, ID: ${authIdentity.id}`);
    }

    // 2. Fetch the user
    const users = await userModuleService.listUsers({ email: admin_email });
    if (users.length > 0) {
      const userId = users[0].id;
      // 3. Ensure they are linked
      try {
        await remoteLink.create([{
          [Modules.USER]: { user_id: userId },
          [Modules.AUTH]: { auth_identity_id: authIdentity.id }
        }]);
        console.log(`Linked User ${userId} with AuthIdentity ${authIdentity.id}`);
      } catch (innerE) {
        console.log(`Link probably already exists for ${admin_email}:`, innerE.message);
      }
    }
  }

  console.log("Completely synced users & auth identities!");
}
