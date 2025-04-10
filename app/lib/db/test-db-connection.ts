import { query, getConnection, releaseConnection } from "./db";

async function testConnection() {
  let connection;
  try {
    console.log("Testing database connection...");
    const connResult = await getConnection();
    if (connResult.error) {
      throw new Error(connResult.error);
    }
    connection = connResult.connection;
    const result = await query("SELECT 1 as test");
    console.log("Connection successful:", result);
    return true;
  } catch (error) {
    console.error("Connection failed:", error);
    return false;
  } finally {
    if (connection) {
      await releaseConnection(connection);
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testConnection()
    .then((success) => {
      if (success) {
        console.log("Database connection test passed");
        process.exit(0);
      } else {
        console.log("Database connection test failed");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Unexpected error:", error);
      process.exit(1);
    });
}

export default testConnection;
