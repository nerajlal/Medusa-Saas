import { ExecArgs } from "@medusajs/framework/types";

export default async function testRLSBehavior({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  
  console.log("Testing RLS with current products...");

  // 1. Set tenant to 'nike-shop'
  await pgConnection.raw("SET app.bypass_rls = 'false'");
  await pgConnection.raw("SET app.current_tenant_id = 'nike-shop'");
  
  const { rows: nikeVisible } = await pgConnection.raw("SELECT title, tenant_id FROM product");
  console.log(`With tenant='nike-shop', visible products: ${nikeVisible.length}`);
  nikeVisible.forEach(r => console.log(`- [${r.tenant_id}] ${r.title}`));

  // 2. Set tenant to something else
  await pgConnection.raw("SET app.current_tenant_id = 'choco-bliss'");
  const { rows: chocoVisible } = await pgConnection.raw("SELECT title, tenant_id FROM product");
  console.log(`\nWith tenant='choco-bliss', visible products: ${chocoVisible.length}`);
  chocoVisible.forEach(r => console.log(`- [${r.tenant_id}] ${r.title}`));

  // 3. Set to empty
  await pgConnection.raw("SET app.current_tenant_id = ''");
  const { rows: emptyVisible } = await pgConnection.raw("SELECT title, tenant_id FROM product");
  console.log(`\nWith tenant='', visible products: ${emptyVisible.length}`);
  emptyVisible.forEach(r => console.log(`- [${r.tenant_id}] ${r.title}`));
}
