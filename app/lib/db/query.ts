import mysql from "mysql2/promise";

// Define types for database clients
export type QueryClient =
  | mysql.Pool
  | mysql.PoolConnection;
export type TransactionClient =
  mysql.PoolConnection;
export type QueryResult<T = any> = T[];

// Create database pool with proper connection configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Query function with proper typing
export async function query<T = any>(
  text: string,
  params?: any[],
  client: QueryClient = pool
): Promise<{
  data: QueryResult<T> | null;
  error: string | null;
}> {
  try {
    const [rows] = await client.execute(
      text,
      params
    );
    return { data: rows as T[], error: null };
  } catch (error) {
    console.error("Database query error:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Database query failed",
    };
  }
}

// Transaction function with proper typing
export async function transaction<T>(
  callback: (
    client: TransactionClient
  ) => Promise<T>
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
  pool,
};
