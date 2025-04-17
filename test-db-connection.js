require("dotenv").config();
const mysql = require("mysql2/promise");

async function testConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "3306"),
  });

  try {
    await connection.connect();
    console.log("Successfully connected to the database!");

    // Test query
    const [rows] = await connection.execute("SHOW TABLES");
    console.log("Tables in database:", rows);

    await connection.end();
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

testConnection();
