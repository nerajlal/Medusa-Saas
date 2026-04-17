import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function dumpIdentities({ container }: ExecArgs) {
  const authModuleService = container.resolve(Modules.AUTH);
  
  const authIdentities = await authModuleService.listAuthIdentities({});
  
  console.log("Existing identities:");
  authIdentities.forEach(i => console.log(`- ID: ${i.id}, Entity ID: ${i.entity_id}`));
}
