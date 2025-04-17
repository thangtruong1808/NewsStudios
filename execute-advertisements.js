// Script to execute the SQL queries for inserting advertisements
const mysql = require("mysql2/promise");
const fs = require("fs");

async function executeQueries() {
  // Database configuration
  const dbConfig = {
    host: "srv876.hstgr.io",
    user: "u506579725_thangtruong",
    password: "052025ThangTruong!@",
    database: "u506579725_nextjs_mysql",
    port: 3306,
  };

  try {
    // Create a connection
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database successfully");

    // Read the SQL file
    const sqlFile = fs.readFileSync("./insert-advertisements.sql", "utf8");

    // Split the file into individual queries
    const queries = sqlFile.split(";").filter((query) => query.trim() !== "");

    console.log(`Found ${queries.length} queries to execute`);

    // Execute each query
    for (let i = 0; i < queries.length; i++) {
      try {
        console.log(`\nExecuting query ${i + 1}:`);
        console.log(queries[i].substring(0, 100) + "...");

        await connection.execute(queries[i]);
        console.log(`Query ${i + 1} executed successfully`);
      } catch (error) {
        console.error(`Error executing query ${i + 1}:`, error.message);
        console.error("Full error:", error);
      }
    }

    // Close the connection
    await connection.end();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error:", error);
  }
}

executeQueries();
