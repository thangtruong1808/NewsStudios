import mysql from "mysql2/promise";
import { getConnection } from "./db";

// Define types for database clients
export type QueryClient = mysql.Pool | mysql.PoolConnection;
export type TransactionClient = mysql.PoolConnection;
export type QueryResult<T = any> = T[];

// Query function with proper typing
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{
  data: T[] | null;
  error: string | null;
}> {
  let client: Awaited<ReturnType<typeof getConnection>> | undefined;
  try {
    client = await getConnection();
    if (!client.connection) {
      throw new Error("Failed to get database connection");
    }
    const [rows] = await client.connection.execute(text, params);
    return { data: rows as T[], error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Database query failed",
    };
  } finally {
    if (client?.connection) {
      client.connection.release();
    }
  }
}

// Transaction function with proper typing
export async function transaction<T>(
  // eslint-disable-next-line no-unused-vars
  callback: (connection: TransactionClient) => Promise<T>
): Promise<T> {
  const { connection, error } = await getConnection();
  if (!connection) {
    throw new Error(error ?? "Failed to obtain database connection");
  }
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

const queryUtils = {
  query,
  transaction,
};

export default queryUtils;
