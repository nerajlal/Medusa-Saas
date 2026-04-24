import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createRegionsWorkflow, updateStoresWorkflow } from "@medusajs/medusa/core-flows";

export default async function createIndiaRegion({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  logger.info("Creating India Region...");

  try {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "India",
            currency_code: "inr",
            countries: ["in"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });

    const region = regionResult[0];
    logger.info(`Successfully created India Region! ID: ${region.id}`);

    // Let's also output this to a file so it's easy to grab
    const fs = require("fs");
    fs.writeFileSync("india_region_id.txt", region.id);

  } catch (error) {
    logger.error("Failed to create region:", error);
  }
}
