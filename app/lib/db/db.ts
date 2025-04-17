"use server";

import mysql from "mysql2/promise";

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000, // Increased to 30 seconds
  acquireTimeout: 30000, // Added acquire timeout
  timeout: 60000, // Added general query timeout
  enableKeepAlive: true, // Enable keep-alive
  keepAliveInitialDelay: 10000, // Keep-alive ping every 10 seconds
  multipleStatements: true, // Allow multiple statements
  // Add connection retry strategy
  maxReconnects: 10,
  reconnectDelay: 2000, // 2 seconds between reconnect attempts
};

// Validate required environment variables
if (
  !dbConfig.host ||
  !dbConfig.user ||
  !dbConfig.password ||
  !dbConfig.database
) {
  console.error("Missing database configuration:", {
    host: dbConfig.host ? "Set" : "Missing",
    user: dbConfig.user ? "Set" : "Missing",
    password: dbConfig.password ? "Set" : "Missing",
    database: dbConfig.database ? "Set" : "Missing",
  });

  // Instead of throwing an error, use default values for development
  if (process.env.NODE_ENV === "development") {
    console.warn("Using default database configuration for development");
    dbConfig.host = dbConfig.host || "localhost";
    dbConfig.user = dbConfig.user || "root";
    dbConfig.password = dbConfig.password || "";
    dbConfig.database = dbConfig.database || "personal_portfolio";
  } else {
    throw new Error(
      "Missing required database configuration. Please check your .env file."
    );
  }
}

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection and handle reconnection
async function testConnection(retries = 3, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log("Database connection established successfully");
      connection.release();
      return true;
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed:`, err);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.error(`Failed to connect after ${retries} attempts`);
  return false;
}

// Initialize connection
testConnection()
  .then((success) => {
    if (!success) {
      console.error("Initial database connection failed");
    }
  })
  .catch((err) => {
    console.error("Error in connection test:", err);
  });

/**
 * Gets the database pool
 * @returns The database pool
 */
export async function getPool() {
  return pool;
}

/**
 * Executes a query on the database
 * @param sqlQuery The SQL query to execute
 * @param params Parameters for the query
 * @returns The query results
 */
export async function query(sqlQuery: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sqlQuery, params);
    return { data: results, error: null };
  } catch (error) {
    console.error("Database query error:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Gets a connection from the pool
 * @returns A database connection
 */
export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return { connection, error: null };
  } catch (error) {
    console.error("Database connection error:", error);
    return {
      connection: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Begins a transaction
 * @param connection The database connection
 * @returns The result of starting the transaction
 */
export async function beginTransaction(connection: mysql.PoolConnection) {
  try {
    await connection.beginTransaction();
    return { error: null };
  } catch (error) {
    console.error("Transaction begin error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Commits a transaction
 * @param connection The database connection
 * @returns The result of committing the transaction
 */
export async function commitTransaction(connection: mysql.PoolConnection) {
  try {
    await connection.commit();
    return { error: null };
  } catch (error) {
    console.error("Transaction commit error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Rollbacks a transaction
 * @param connection The database connection
 * @returns The result of rolling back the transaction
 */
export async function rollbackTransaction(connection: mysql.PoolConnection) {
  try {
    await connection.rollback();
    return { error: null };
  } catch (error) {
    console.error("Transaction rollback error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Releases a connection back to the pool
 * @param connection The database connection to release
 */
export async function releaseConnection(connection: mysql.PoolConnection) {
  try {
    connection.release();
    return { error: null };
  } catch (error) {
    console.error("Connection release error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
