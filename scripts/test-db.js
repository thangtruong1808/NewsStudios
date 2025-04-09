// Simple script to test database connection
require("dotenv").config({ path: "./app/.env" });
const mysql = require("mysql2/promise");

async function testConnection() {
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
  };

  console.log("Testing connection with config:", {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port,
  });

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Successfully connected to the database!");

    // Test a simple query
    const [rows] = await connection.execute("SELECT 1 as test");
    console.log("Query result:", rows);

    await connection.end();
    console.log("Connection closed.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

testConnection();
