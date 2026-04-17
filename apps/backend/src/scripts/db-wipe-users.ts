import { ExecArgs } from "@medusajs/framework/types";

export default async function dbWipeUsers({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  
  // 1. Get emails
  const { rows: stores } = await pgConnection.raw("SELECT admin_email FROM store_settings WHERE deleted_at IS NULL AND admin_email IS NOT NULL");
  const emails = stores.map(s => s.admin_email);
  
  if (emails.length === 0) return;

  const emailList = emails.map(e => `'${e}'`).join(',');
  
  // 2. Wipe from Medusa core users
  await pgConnection.raw(`DELETE FROM "user" WHERE email IN (${emailList})`);
  console.log("Wiped from user table");

  // Wipe from auth modules - auth_identity maps provider_identities.
  // We can just wipe all auth identities since this is a dev/stage and recreating them is easy,
  // but let's be surgical. Since we saw ID `authid_<stuff>`, let's wipe any provider identity matching auth_identity...
  // Even easier, just wipe provider identities with entity_id in our emails, but wait... provider_identity doesn't have entity_id in v2!
  // auth_identity HAS auth_identity_id or provider_id? No, auth_identity and provider_identity tables exist.
  // Wait, let's just use emailpass.register to gracefully handle creating users.
}
