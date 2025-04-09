import { query, closeConnection } from "./db";

async function checkTables() {
  try {
    console.log("Checking database tables...");

    // Check if the Articles table exists
    const articlesTable = await query("SHOW TABLES LIKE 'Articles'");
    console.log("Articles table exists:", articlesTable.length > 0);

    if (articlesTable.length > 0) {
      // Check Articles table structure
      const articlesColumns = await query("SHOW COLUMNS FROM Articles");
      console.log("Articles table columns:", articlesColumns);

      // Check if there are any records
      const articlesCount = await query(
        "SELECT COUNT(*) as count FROM Articles"
      );
      console.log(`Number of articles: ${articlesCount[0].count}`);
    }

    // Check if the Categories table exists
    const categoriesTable = await query("SHOW TABLES LIKE 'Categories'");
    console.log("Categories table exists:", categoriesTable.length > 0);

    if (categoriesTable.length > 0) {
      // Check Categories table structure
      const categoriesColumns = await query("SHOW COLUMNS FROM Categories");
      console.log("Categories table columns:", categoriesColumns);

      // Check if there are any records
      const categoriesCount = await query(
        "SELECT COUNT(*) as count FROM Categories"
      );
      console.log(`Number of categories: ${categoriesCount[0].count}`);
    }

    // Check if the Authors table exists
    const authorsTable = await query("SHOW TABLES LIKE 'Authors'");
    console.log("Authors table exists:", authorsTable.length > 0);

    if (authorsTable.length > 0) {
      // Check Authors table structure
      const authorsColumns = await query("SHOW COLUMNS FROM Authors");
      console.log("Authors table columns:", authorsColumns);

      // Check if there are any records
      const authorsCount = await query("SELECT COUNT(*) as count FROM Authors");
      console.log(`Number of authors: ${authorsCount[0].count}`);
    }

    return true;
  } catch (error) {
    console.error("Error checking tables:", error);
    return false;
  } finally {
    await closeConnection();
  }
}

// Run the check if this file is executed directly
if (require.main === module) {
  checkTables()
    .then((success) => {
      if (success) {
        console.log("Database tables check completed");
        process.exit(0);
      } else {
        console.log("Database tables check failed");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Unexpected error:", error);
      process.exit(1);
    });
}

export default checkTables;
