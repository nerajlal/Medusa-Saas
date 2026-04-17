import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function purgeAndRecreateUsers({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  const userModuleService = container.resolve(Modules.USER);
  const authModuleService = container.resolve(Modules.AUTH);
  
  const { rows: stores } = await pgConnection.raw("SELECT tenant_id, store_name, admin_email FROM store_settings WHERE deleted_at IS NULL AND admin_email IS NOT NULL");
  
  for (const store of stores) {
    const { admin_email } = store;

    // 1. Delete user
    const users = await userModuleService.listUsers({ email: admin_email });
    if (users.length > 0) {
      await userModuleService.deleteUsers(users.map(u => u.id));
      console.log(`Deleted user(s) for ${admin_email}`);
    }

    // 2. Delete Auth Identities
    // listAuthIdentities doesn't easily filter by email if the column is tricky, so fetch all and filter
    const authIdentities = await authModuleService.listAuthIdentities({ provider: 'emailpass' }, { relations: ["provider_identities"] });
    for (const identity of authIdentities) {
      // Find identity matching the email
      // Sometimes it's inside provider_identities as entity_id or identifier
       if (
           identity.id === `authid_${admin_email}` || 
           (identity as any).entity_id === admin_email || 
           identity.provider_identities?.some(p => (p as any).entity_id === admin_email || (p as any).identifier === admin_email) ||
           identity.id === `authid_${admin_email.split('@')[0]}`
       ) {
           await authModuleService.deleteAuthIdentities([identity.id]);
           console.log(`Deleted AuthIdentity ${identity.id} for ${admin_email}`);
       }
    }
  }

  // Also physically wipe them from db to be absolutely sure
  console.log("Purge complete, use medusa user to recreate.");
}
