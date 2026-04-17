import { ExecArgs } from "@medusajs/framework/types";

export default async function wipeAuth({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  
  await pgConnection.raw("DELETE FROM provider_identity");
  await pgConnection.raw("DELETE FROM auth_identity");
  
  console.log("Completely wiped all Auth Identities!");
}
