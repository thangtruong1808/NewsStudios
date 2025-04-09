import { config } from "dotenv";
import path from "path";
import fs from "fs";

// Try to load .env file from different locations
const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "app", ".env"),
];

let envLoaded = false;

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn("No .env file found in the expected locations");
}

// Export environment variables with type safety
export const env = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT || "3306",
  NODE_ENV: process.env.NODE_ENV || "development",
};
