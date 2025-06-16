"use server";

import { query } from "./query";

/**
 * Creates all necessary tables in the database
 */
export async function setupDatabase() {
  try {
    // Create Users table
    await query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user', 'editor') NOT NULL DEFAULT 'user',
        user_image VARCHAR(255),
        description TEXT,
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Categories table
    await query(`
      CREATE TABLE IF NOT EXISTS Categories (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create SubCategories table
    await query(`
      CREATE TABLE IF NOT EXISTS SubCategories (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        category_id INT(11) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE
      )
    `);

    // Create Authors table
    await query(`
      CREATE TABLE IF NOT EXISTS Authors (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Articles table
    await query(`
      CREATE TABLE IF NOT EXISTS Articles (
        id INT(11) NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category_id INT(11),
        sub_category_id INT(11),
        author_id INT(11),
        user_id INT(11),
        image VARCHAR(255),
        video VARCHAR(255),
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_featured BOOLEAN DEFAULT FALSE,
        headline_priority INT DEFAULT 0,
        headline_image_url VARCHAR(255),
        headline_video_url VARCHAR(255),
        is_trending BOOLEAN DEFAULT FALSE,        
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL,
        FOREIGN KEY (author_id) REFERENCES Authors(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
      )
    `);

    // Create Tags table
    await query(`
      CREATE TABLE IF NOT EXISTS Tags (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        color VARCHAR(50) NOT NULL,
        category_id INT(11),
        sub_category_id INT(11),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL,
        FOREIGN KEY (sub_category_id) REFERENCES SubCategories(id) ON DELETE SET NULL
      )
    `);

    // Create Article_Tags junction table
    await query(`
      CREATE TABLE IF NOT EXISTS Article_Tags (
        article_id INT(11) NOT NULL,
        tag_id INT(11) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES Tags(id) ON DELETE CASCADE
      )
    `);

    // Create Comments table
    await query(`
      CREATE TABLE IF NOT EXISTS Comments (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        article_id INT(11) NOT NULL,
        user_id INT(11) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    // Create Likes table
    await query(`
      CREATE TABLE IF NOT EXISTS Likes (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        article_id INT(11) NOT NULL,
        user_id INT(11) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (article_id, user_id),
        FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    // Create Shares table
    await query(`
      CREATE TABLE IF NOT EXISTS Shares (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        article_id INT(11) NOT NULL,
        user_id INT(11) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    // Create Bookmarks table
    await query(`
      CREATE TABLE IF NOT EXISTS Bookmarks (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        article_id INT(11) NOT NULL,
        user_id INT(11) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_bookmark (article_id, user_id),
        FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    // Create Images table
    await query(`
      CREATE TABLE IF NOT EXISTS Images (
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

    // Create Videos table
    await query(`
      CREATE TABLE IF NOT EXISTS Videos (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        article_id INT(11) NOT NULL,
        video_url VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE
      )
    `);

    // Create Views table
    await query(`
      CREATE TABLE IF NOT EXISTS Views (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        article_id INT(11) NOT NULL,
        user_id INT(11) NULL,
        ip_address VARCHAR(45) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
      )
    `);

    return { success: true };
  } catch (error) {
    console.error("Error setting up database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// -- Step 1: Drop existing foreign keys (if they already exist)
// ALTER TABLE Advertisements DROP FOREIGN KEY Advertisements_ibfk_1;
// ALTER TABLE Advertisements DROP FOREIGN KEY Advertisements_ibfk_2;
// ALTER TABLE Advertisements DROP FOREIGN KEY Advertisements_ibfk_3;

// -- Step 2: Modify the columns to allow NULLs
// ALTER TABLE Advertisements
//   MODIFY sponsor_id INT(11) NULL,
//   MODIFY article_id INT(11) NULL,
//   MODIFY category_id INT(11) NULL;

// -- Step 3: Add foreign key constraints back with ON DELETE SET NULL
// ALTER TABLE Advertisements
//   ADD CONSTRAINT fk_sponsor FOREIGN KEY (sponsor_id) REFERENCES Sponsors(id) ON DELETE SET NULL,
//   ADD CONSTRAINT fk_article FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE SET NULL,
//   ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL;
