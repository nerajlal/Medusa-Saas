import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function testAuth({ container }: ExecArgs) {
  const authModuleService = container.resolve(Modules.AUTH);
  
  const authIdentities = await authModuleService.listAuthIdentities({});
  console.log(`Found ${authIdentities.length} total identities`);

  for (const identity of authIdentities) {
    if (identity.provider === "emailpass") {  // wait, provider might not exist on the returned payload but usually it's in provider
      const email = (identity as any).entity_id ?? (identity as any).identifier ?? (identity as any).email ?? identity.id;
      try {
        const result = await authModuleService.authenticate("emailpass", {
          url: "",
          headers: {},
          query: {},
          body: {
            entity_id: email, // wait, without real body params it might be tricky
          },
          protocol: "http",
        } as any);
        console.log(`Auth result for ${identity.id}:`, result.success);
      } catch (e) {
        console.error(`Auth failed for ${identity.id}`);
      }
    }
  }
}
