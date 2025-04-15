import { query } from "../app/lib/db/query";

async function verifySchema() {
  try {
    // Get all tables
    const tablesResult = await query(`
      SELECT TABLE_NAME, TABLE_COLLATION
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
      ORDER BY TABLE_NAME
    `);

    if (tablesResult.error) {
      console.error("Error getting tables:", tablesResult.error);
      return;
    }

    console.log("Tables in database:");
    console.log(JSON.stringify(tablesResult.data, null, 2));

    // For each table, get its structure
    for (const table of tablesResult.data) {
      const tableName = table.TABLE_NAME;
      console.log(`\nStructure for table ${tableName}:`);

      const columnsResult = await query(
        `
        SELECT 
          COLUMN_NAME,
          COLUMN_TYPE,
          IS_NULLABLE,
          COLUMN_DEFAULT,
          COLUMN_KEY,
          EXTRA
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `,
        [tableName]
      );

      if (columnsResult.error) {
        console.error(
          `Error getting columns for ${tableName}:`,
          columnsResult.error
        );
        continue;
      }

      console.log("Columns:", JSON.stringify(columnsResult.data, null, 2));

      // Get foreign keys
      const foreignKeysResult = await query(
        `
        SELECT
          COLUMN_NAME,
          CONSTRAINT_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
          AND REFERENCED_TABLE_NAME IS NOT NULL
      `,
        [tableName]
      );

      if (foreignKeysResult.error) {
        console.error(
          `Error getting foreign keys for ${tableName}:`,
          foreignKeysResult.error
        );
        continue;
      }

      if (foreignKeysResult.data.length > 0) {
        console.log(
          "Foreign Keys:",
          JSON.stringify(foreignKeysResult.data, null, 2)
        );
      }
    }
  } catch (error) {
    console.error("Error verifying schema:", error);
  }
}

// Run the verification
verifySchema();
