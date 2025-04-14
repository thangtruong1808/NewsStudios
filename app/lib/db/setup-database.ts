import { setupDatabase } from "./setup";

async function main() {
  try {
    console.log("Starting database setup...");
    await setupDatabase();
    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error during database setup:", error);
    process.exit(1);
  }
}

main();
