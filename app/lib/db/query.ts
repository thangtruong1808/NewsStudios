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

export default {
  query,
  transaction,
};
