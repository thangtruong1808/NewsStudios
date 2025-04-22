import mysql from "mysql2/promise";
import { ResultSetHeader } from "mysql2";

// Database configuration with fallback values for development
const dbConfig = {
  host: process.env.DB_HOST || "srv876.hstgr.io",
  user: process.env.DB_USER || "u506579725_thangtruong",
  password: process.env.DB_PASSWORD || "052025ThangTruong!@",
  database: process.env.DB_NAME || "u506579725_nextjs_mysql",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 3, // Reduced from 5 to 3 to stay well under the server limit
  queueLimit: 10, // Added queue limit to handle connection requests when pool is full
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000, // 10 seconds timeout
  acquireTimeout: 10000, // 10 seconds timeout for acquiring a connection
  idleTimeout: 60000, // Close idle connections after 60 seconds
  maxIdle: 2, // Maximum number of idle connections to keep in the pool
};

// Create the connection pool
export const pool = mysql.createPool(dbConfig);

// Test the connection and log status
pool
  .getConnection()
  .then((connection) => {
    console.log("Successfully connected to the database");
    connection.release();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    if (error.code === "ECONNREFUSED") {
      console.error(
        "Connection refused. Please check if MySQL server is running and accessible."
      );
    }
  });

// Query function with improved error handling
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{
  data: T[] | null;
  error: string | null;
}> {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(text, params);
    return { data: rows as T[], error: null };
  } catch (error) {
    console.error("Database query error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Database query failed";
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        return {
          data: null,
          error:
            "Unable to connect to the database. Please check your database connection.",
        };
      }
      if (error.message.includes("ER_ACCESS_DENIED_ERROR")) {
        return {
          data: null,
          error: "Access denied. Please check your database credentials.",
        };
      }
      if (error.message.includes("ER_BAD_DB_ERROR")) {
        return {
          data: null,
          error: "Database not found. Please check your database name.",
        };
      }
    }
    return { data: null, error: errorMessage };
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Transaction function with proper connection handling
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
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
