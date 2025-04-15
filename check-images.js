// Script to check if images are accessible from the hosting server
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkImages() {
  // Connect to the database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("Database connection established successfully");

  try {
    // Get a list of images from the database
    const [rows] = await connection.execute(
      "SELECT id, image_url FROM Images LIMIT 5"
    );

    console.log(`Found ${rows.length} images in the database`);

    // Check each image URL
    for (const row of rows) {
      const imageUrl = row.image_url;
      if (!imageUrl) {
        console.log(`Image ID ${row.id} has no URL, skipping`);
        continue;
      }

      // Extract just the filename if there's a path
      const filename = imageUrl.includes("/")
        ? imageUrl.split("/").pop()
        : imageUrl;

      if (!filename) {
        console.log(
          `Image ID ${row.id} has an invalid URL format: ${imageUrl}`
        );
        continue;
      }

      // Try different URL formats
      const urls = [
        // Direct URL from your hosting server
        `https://thang-truong.com/Images/${filename}`,
        // Alternative URL format
        `https://srv876-files.hstgr.io/83e36b91bb471f62/files/public_html/Images/${filename}`,
        // Relative URL (for testing)
        `/Images/${filename}`,
      ];

      console.log(`\nChecking image ID ${row.id} (${filename}):`);

      for (const url of urls) {
        try {
          console.log(`  Testing URL: ${url}`);
          const response = await fetch(url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              Accept:
                "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
              Referer: "https://thang-truong.com/",
            },
          });

          console.log(`  Status: ${response.status} ${response.statusText}`);
          console.log(
            `  Headers:`,
            Object.fromEntries(response.headers.entries())
          );

          if (response.ok) {
            console.log(`  ✅ URL is accessible: ${url}`);
          } else {
            console.log(`  ❌ URL is not accessible: ${url}`);
          }
        } catch (error) {
          console.log(`  ❌ Error checking URL ${url}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await connection.end();
  }
}

checkImages().catch(console.error);
