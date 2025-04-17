const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "u506579725_nextjs_mysql",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function createTables() {
  let connection;

  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database successfully");

    // Read the schema file
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Split the schema into individual statements
    const statements = schema
      .split(";")
      .filter((statement) => statement.trim());

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
        console.log("Executed SQL statement successfully");
      }
    }

    console.log("All tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

// Run the function
createTables();
