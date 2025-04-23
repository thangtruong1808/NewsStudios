import mysql from "mysql2/promise";
import { pool } from "./db";

// Define types for database clients
export type QueryClient = mysql.Pool | mysql.PoolConnection;
export type TransactionClient = mysql.PoolConnection;
export type QueryResult<T = any> = T[];

// Query function with proper typing
export async function query<T = any>(
  text: string,
  params?: any[],
  client: QueryClient = pool
): Promise<{
  data: QueryResult<T> | null;
  error: string | null;
}> {
  let connection: mysql.PoolConnection | null = null;
  try {
    if (client === pool) {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(text, params);
      return { data: rows as T[], error: null };
    } else {
      const [rows] = await client.execute(text, params);
      return { data: rows as T[], error: null };
    }
  } catch (error) {
    console.error("Database query error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Database query failed",
    };
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Transaction function with proper typing
export async function transaction<T>(
  callback: (client: TransactionClient) => Promise<T>
): Promise<T> {
  console.log("Starting transaction");
  const connection = await pool.getConnection();
  console.log("Transaction connection established");

  try {
    console.log("Beginning transaction");
    await connection.beginTransaction();

    console.log("Executing transaction callback");
    const result = await callback(connection);
    console.log("Transaction callback completed successfully");

    console.log("Committing transaction");
    await connection.commit();
    console.log("Transaction committed successfully");

    return result;
  } catch (error) {
    console.error("Transaction error:", error);
    console.log("Rolling back transaction");
    await connection.rollback();
    throw error;
  } finally {
    console.log("Releasing transaction connection");
    connection.release();
  }
}

export default {
  query,
  transaction,
};
