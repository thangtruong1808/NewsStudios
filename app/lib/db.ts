import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from the app/.env file
dotenv.config({ path: path.resolve(process.cwd(), "app/.env") });

const dbConfig = {
  host: process.env.DB_HOST?.trim(),
  user: process.env.DB_USER?.trim(),
  password: process.env.DB_PASSWORD?.trim(),
  database: process.env.DB_NAME?.trim(),
  port: 3306,
  connectTimeout: 10000,
};

// Validate database configuration
if (
  !dbConfig.host ||
  !dbConfig.user ||
  !dbConfig.password ||
  !dbConfig.database
) {
  console.error("Database configuration missing:", {
    host: dbConfig.host ? "defined" : "missing",
    user: dbConfig.user ? "defined" : "missing",
    password: dbConfig.password ? "defined" : "missing",
    database: dbConfig.database ? "defined" : "missing",
  });
  throw new Error("Database configuration missing");
}

export async function connectToDatabase() {
  try {
    console.log("Connecting to database with config:", {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      // Don't log the password
    });

    const connection = await mysql.createConnection(dbConfig);
    console.log("Database connection established successfully");
    return { db: connection };
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw new Error("Failed to connect to database");
  }
}
