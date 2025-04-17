// Script to check existing IDs in the database
const mysql = require("mysql2/promise");

async function checkIds() {
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

    // Check sponsors
    const [sponsors] = await connection.execute(
      "SELECT id, name FROM Sponsors ORDER BY id"
    );
    console.log("\nSponsors:");
    console.log(sponsors);

    // Check articles
    const [articles] = await connection.execute(
      "SELECT id, title FROM Articles ORDER BY id"
    );
    console.log("\nArticles:");
    console.log(articles);

    // Check categories
    const [categories] = await connection.execute(
      "SELECT id, name FROM Categories ORDER BY id"
    );
    console.log("\nCategories:");
    console.log(categories);

    // Close the connection
    await connection.end();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error:", error);
  }
}

checkIds();
