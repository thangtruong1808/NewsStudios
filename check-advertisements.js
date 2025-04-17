// Script to check the inserted advertisements
const mysql = require("mysql2/promise");

async function checkAdvertisements() {
  // Database configuration
  const dbConfig = {
    host: "srv876.hstgr.io",
    user: "u506579725_thangtruong",
    password: "052025ThangTruong!@",
    database: "u506579725_nextjs_mysql",
    port: 3306,
  };

  try {
    // Create a connection
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database successfully");

    // Check advertisements
    const [ads] = await connection.execute(`
      SELECT 
        a.*,
        s.name as sponsor_name,
        art.title as article_title,
        c.name as category_name
      FROM Advertisements a
      LEFT JOIN Sponsors s ON a.sponsor_id = s.id
      LEFT JOIN Articles art ON a.article_id = art.id
      LEFT JOIN Categories c ON a.category_id = c.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `);

    console.log("\nRecently inserted advertisements:");
    ads.forEach((ad, index) => {
      console.log(`\nAdvertisement ${index + 1}:`);
      console.log("ID:", ad.id);
      console.log("Sponsor:", ad.sponsor_name);
      console.log("Article:", ad.article_title);
      console.log("Category:", ad.category_name);
      console.log("Type:", ad.ad_type);
      console.log("Content:", ad.ad_content);
      console.log("Start Date:", ad.start_date);
      console.log("End Date:", ad.end_date);
    });

    // Close the connection
    await connection.end();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error:", error);
  }
}

checkAdvertisements();
