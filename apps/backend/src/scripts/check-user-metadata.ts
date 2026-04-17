import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function checkUserMetadata({ container }: ExecArgs) {
  const userModuleService = container.resolve(Modules.USER);
  const users = await userModuleService.listUsers({});
  
  console.log("Users and their metadata:");
  users.forEach(u => {
    console.log(`- Email: ${u.email}, Metadata: ${JSON.stringify(u.metadata)}`);
  });

  const authModuleService = container.resolve(Modules.AUTH);
  const authIdentities = await authModuleService.listAuthIdentities({});
  console.log("\nAuth Identities and their app_metadata:");
  authIdentities.forEach(i => {
    console.log(`- ID: ${i.id}, Entity ID: ${i.entity_id}, App Metadata: ${JSON.stringify(i.app_metadata)}`);
  });
}
