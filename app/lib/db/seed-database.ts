import { query } from "./db";
import fs from "fs";
import path from "path";

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Read the SQL file
    const sqlFilePath = path.join(
      process.cwd(),
      "app",
      "lib",
      "db",
      "seed-data.sql"
    );
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        await query(statement);
        console.log("Executed statement successfully");
      } catch (error) {
        console.error("Error executing statement:", error);
        console.error("Failed statement:", statement);
      }
    }

    console.log("Database seeding completed successfully!");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error seeding database:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unknown error occurred",
    };
  }
}
