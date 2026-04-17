import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function fixUserMetadata({ container }: ExecArgs) {
  const userModuleService = container.resolve(Modules.USER);
  const authModuleService = container.resolve(Modules.AUTH);
  
  const mapping = [
    { email: "choco@test.com", tenant_id: "choco-bliss" },
    { email: "owner@raleys.com", tenant_id: "raleys-market" },
    { email: "nike@test.com", tenant_id: "nike-shop" },
    { email: "apple@test.com", tenant_id: "apple-premium" },
    { email: "adidas@test.com", tenant_id: "adidas-boost" }
  ];

  console.log("Fixing user and auth identity metadata...");

  for (const item of mapping) {
    try {
      // 1. Update User metadata
      const users = await userModuleService.listUsers({ email: item.email });
      if (users.length > 0) {
        await userModuleService.updateUsers({
            id: users[0].id,
            metadata: { tenant_id: item.tenant_id }
        });
        console.log(`Updated User metadata for ${item.email}`);
      }

      // 2. Update Auth Identity app_metadata
      // Search for identity where entity_id or identifier matches email
      const allIdentities = await authModuleService.listAuthIdentities({}, { relations: ["provider_identities"] });
      const identity = allIdentities.find(i => 
          i.entity_id === item.email || 
          i.provider_identities?.some(p => (p as any).entity_id === item.email || (p as any).identifier === item.email)
      );

      if (identity) {
        await authModuleService.updateAuthIdentities({
            id: identity.id,
            app_metadata: { 
                ...identity.app_metadata,
                tenant_id: item.tenant_id 
            }
        });
        console.log(`Updated Auth Identity app_metadata for ${item.email}`);
      } else {
        console.log(`Could not find Auth Identity for ${item.email}`);
      }
    } catch (e) {
      console.error(`Error fixing metadata for ${item.email}:`, e.message);
    }
  }

  console.log("Metadata fix complete!");
}
