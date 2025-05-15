import { query } from "./db";

export async function resetImagesTable() {
  try {
    // Drop the existing table
    await query("DROP TABLE IF EXISTS Images");
    console.log("Dropped existing Images table");

    // Create the table with the correct structure
    await query(`
      CREATE TABLE Images (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        image_url VARCHAR(255) NOT NULL,
        article_id INT(11) NULL,
        description TEXT,
        type ENUM('banner', 'video', 'thumbnail', 'gallery') NOT NULL,
        entity_type ENUM('advertisement', 'article', 'author', 'category') NOT NULL,
        entity_id INT(11) NOT NULL,
        is_featured BOOLEAN DEFAULT FALSE,
        display_order INT(11) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_entity (entity_type, entity_id),
        INDEX idx_type (type),
        INDEX idx_article (article_id),
        FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE SET NULL
      )
    `);
    console.log("Created new Images table with correct structure");

    return { success: true };
  } catch (error) {
    console.error("Error resetting Images table:", error);
    return { success: false, error };
  }
}
