import { ExecArgs } from "@medusajs/framework/types";

export default async function wipeAllUsers({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  
  await pgConnection.raw("DELETE FROM provider_identity");
  await pgConnection.raw("DELETE FROM auth_identity");
  await pgConnection.raw(`DELETE FROM "user"`);
  
  console.log("Completely wiped all Users and Auth Identities!");
}
