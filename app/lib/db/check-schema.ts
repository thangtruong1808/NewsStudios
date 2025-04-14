import { query } from "./db";

export async function getTableSchema(tableName: string) {
  try {
    const result = await query(
      `
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT,
        COLUMN_KEY,
        EXTRA
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `,
      [tableName]
    );

    return { data: result, error: null };
  } catch (error) {
    console.error(`Error fetching schema for table ${tableName}:`, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getAllTables() {
  try {
    const result = await query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `);

    return { data: result, error: null };
  } catch (error) {
    console.error("Error fetching tables:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
