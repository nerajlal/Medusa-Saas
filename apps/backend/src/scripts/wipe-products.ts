import { ExecArgs } from "@medusajs/framework/types";

export default async function wipeProducts({ container }: ExecArgs) {
  const pgConnection = container.resolve("__pg_connection__");
  
  console.log("Wiping all products and associated data...");

  // Must bypass RLS to delete everything
  await pgConnection.raw(`SET app.bypass_rls = 'true'`);

  try {
    // List of tables to wipe related to products
    const tables = [
      'product_variant_price',
      'product_variant',
      'product_option_value',
      'product_option',
      'product_category_product',
      'product_collection_product',
      'product_tag_product',
      'product_image',
      'product'
    ];

    for (const table of tables) {
      try {
        await pgConnection.raw(`DELETE FROM "${table}"`);
        console.log(`Cleared table: ${table}`);
      } catch (e) {
        // Table might not exist or already clear
      }
    }

    console.log("Wipe complete!");
  } catch (error) {
    console.error("Wipe failed:", error.message);
  }
}
