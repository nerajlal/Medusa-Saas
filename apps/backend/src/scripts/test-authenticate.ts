import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function testAuthenticate({ container }: ExecArgs) {
  const authModuleService = container.resolve(Modules.AUTH);
  
  try {
    const result = await authModuleService.authenticate("emailpass", {
      url: "",
      headers: {},
      query: {},
      body: {
        email: "choco@test.com",
        password: "supersecret"
      },
      protocol: "http",
    } as any);

    console.log("Authenticate result:", result);
  } catch (e) {
    console.error("Authenticate error:", e.message);
  }
}
