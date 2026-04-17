import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function checkAllStores({ container }: ExecArgs) {
  const authModuleService = container.resolve(Modules.AUTH);
  
  const storeEmails = [
    "choco@test.com",
    "owner@raleys.com",
    "nike@test.com",
    "apple@test.com",
    "adidas@test.com"
  ];
  
  for (const email of storeEmails) {
      try {
        const result = await authModuleService.authenticate("emailpass", {
          url: "",
          headers: {},
          query: {},
          body: {
            email: email,
            password: "supersecret"
          },
          protocol: "http",
        } as any);

        if (result.success) {
           console.log(`[SUCCESS] User ${email} authenticated successfully. (Entity ID: ${result.authIdentity.entity_id})`);
        } else {
           console.log(`[FAILED] User ${email} login failed: ${result.error}`);
        }
      } catch (e) {
        console.error(`[ERROR] User ${email} encountered exception:`, e.message);
      }
  }
}
