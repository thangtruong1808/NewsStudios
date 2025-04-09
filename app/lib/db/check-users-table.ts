import { query, closeConnection } from "./db";

async function checkUsersTable() {
  try {
    console.log("Checking Users table...");

    // Check if the table exists
    const tables = await query("SHOW TABLES LIKE 'Users'");
    if (tables.length === 0) {
      console.error("Users table does not exist");
      return false;
    }

    console.log("Users table exists");

    // Check table structure
    const columns = await query("SHOW COLUMNS FROM Users");
    console.log(
      "Table columns:",
      columns.map((col) => col.Field)
    );

    // Check if there are any records
    const count = await query("SELECT COUNT(*) as count FROM Users");
    console.log(`Number of records: ${count[0].count}`);

    return true;
  } catch (error) {
    console.error("Error checking Users table:", error);
    return false;
  } finally {
    await closeConnection();
  }
}

// Run the check if this file is executed directly
if (require.main === module) {
  checkUsersTable()
    .then((success) => {
      if (success) {
        console.log("Users table check passed");
        process.exit(0);
      } else {
        console.log("Users table check failed");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Unexpected error:", error);
      process.exit(1);
    });
}

export default checkUsersTable;
