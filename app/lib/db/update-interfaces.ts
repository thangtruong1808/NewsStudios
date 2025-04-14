import "dotenv/config";
import { checkAllTables } from "./check-all-tables";

async function main() {
  try {
    console.log("Starting database schema check...");
    await checkAllTables();
    console.log("\nSchema check completed. Please review the output above.");
  } catch (error) {
    console.error("Error during schema check:", error);
  }
}

// Execute the main function
main().catch(console.error);
