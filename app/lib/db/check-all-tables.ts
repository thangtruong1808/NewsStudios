import { getAllTables, getTableSchema } from "./check-schema";
import { RowDataPacket } from "mysql2";

interface TableInfo extends RowDataPacket {
  TABLE_NAME: string;
}

interface ColumnInfo extends RowDataPacket {
  COLUMN_NAME: string;
  DATA_TYPE: string;
  IS_NULLABLE: string;
  COLUMN_DEFAULT: string | null;
  COLUMN_KEY: string;
  EXTRA: string;
}

export async function checkAllTables() {
  try {
    // Get all tables
    const { data: tablesResult, error: tablesError } = await getAllTables();
    if (tablesError || !tablesResult || !Array.isArray(tablesResult)) {
      console.error("Error getting tables:", tablesError);
      return;
    }

    // Extract tables array from the result
    const tables = tablesResult as TableInfo[];
    console.log(
      "Found tables:",
      tables.map((t: TableInfo) => t.TABLE_NAME).join(", ")
    );

    if (tables.length === 0) {
      console.log("No tables found in the database.");
      return;
    }

    // Get schema for each table
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      console.log(`\nChecking schema for table: ${tableName}`);

      const { data: schemaResult, error: schemaError } = await getTableSchema(
        tableName
      );
      if (schemaError || !schemaResult || !Array.isArray(schemaResult)) {
        console.error(`Error getting schema for ${tableName}:`, schemaError);
        continue;
      }

      const schema = schemaResult as ColumnInfo[];
      console.log("Columns:");
      schema.forEach((column: ColumnInfo) => {
        console.log(
          `  ${column.COLUMN_NAME}: ${column.DATA_TYPE}${
            column.IS_NULLABLE === "YES" ? " (nullable)" : ""
          }${column.COLUMN_DEFAULT ? ` default: ${column.COLUMN_DEFAULT}` : ""}`
        );
      });
    }
  } catch (error) {
    console.error("Error checking tables:", error);
  }
}
