// Component meta
// Description: Provide pooled MySQL helpers for NewsStudios backend.
// Data created: Connection pool instances and transaction helpers.
// Author: thangtruong

import mysql from "mysql2/promise";

// Env guard section
const requiredEnvVars = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_PORT",
];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing database environment variables: ${missingVars.join(", ")}`
  );
}

// Config section
const dbConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 30000,
  idleTimeout: 60000,
  maxIdle: 5,
};

// Pool section
const pool = mysql.createPool(dbConfig);

// Health check section
async function verifyPoolConnection() {
  const connection = await pool.getConnection();
  connection.release();
}

void verifyPoolConnection().catch((err) => {
  throw new Error(`Failed to connect to database: ${err.message}`);
});

export default pool;

// Query helper section
/**
 * Run a SQL query with an optional parameter list.
 */
export async function query<T = unknown>(
  text: string,
  params?: any[]
): Promise<{
  data: T[] | null;
  error: string | null;
}> {
  let connection: mysql.PoolConnection | undefined;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(text, params);
    return { data: rows as T[], error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database query failed";

    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        return {
          data: null,
          error:
            "Database connection refused. Please check if the database server is running.",
        };
      }
      if (error.message.includes("ER_ACCESS_DENIED_ERROR")) {
        return {
          data: null,
          error: "Database access denied. Please verify your credentials.",
        };
      }
      if (error.message.includes("ER_BAD_DB_ERROR")) {
        return {
          data: null,
          error: "Database not found. Please check your database name.",
        };
      }
      if (error.message.includes("ETIMEDOUT")) {
        return {
          data: null,
          error: "Database connection timed out. Please try again.",
        };
      }
      if (error.message.includes("PROTOCOL_CONNECTION_LOST")) {
        return {
          data: null,
          error: "Database connection was lost. Please try again.",
        };
      }
    }
    return { data: null, error: errorMessage };
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (_releaseError) {
        // Ignore release errors to avoid masking primary failure.
      }
    }
  }
}

// Transaction helper section
/**
 * Execute a callback within a transaction, committing when it succeeds.
 */
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

// Connection lifecycle section
/**
 * Obtain a pooled connection for manual control.
 */
export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return { connection, error: null };
  } catch (error) {
    return {
      connection: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Begin a transaction on an existing connection.
 */
export async function beginTransaction(
  connection: mysql.PoolConnection
) {
  try {
    await connection.beginTransaction();
    return { error: null };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Commit the current transaction.
 */
export async function commitTransaction(
  connection: mysql.PoolConnection
) {
  try {
    await connection.commit();
    return { error: null };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Roll back the current transaction.
 */
export async function rollbackTransaction(
  connection: mysql.PoolConnection
) {
  try {
    await connection.rollback();
    return { error: null };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Release a connection back to the pool.
 */
export async function releaseConnection(
  connection: mysql.PoolConnection
) {
  try {
    connection.release();
    return { error: null };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
