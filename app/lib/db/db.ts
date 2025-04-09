"use server";

import mysql from "mysql2/promise";
import { env } from "../env";

// Removed console.log for environment variables loaded

// Database configuration
const dbConfig = {
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: parseInt(env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds timeout
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
  if (env.NODE_ENV === "development") {
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

// Test the connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connection established successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    console.error("Connection details:", {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
    });
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
