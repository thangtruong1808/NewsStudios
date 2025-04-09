"use server";

import { query } from "./db";

/**
 * Creates all necessary tables in the database
 */
export async function setupDatabase() {
  try {
    // Create Users table
    await query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user', 'editor') NOT NULL DEFAULT 'user',
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Categories table
    await query(`
      CREATE TABLE IF NOT EXISTS Categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create SubCategories table
    await query(`
      CREATE TABLE IF NOT EXISTS SubCategories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE,
        UNIQUE KEY unique_subcategory_per_category (category_id, name)
      )
    `);

    // Create Authors table
    await query(`
      CREATE TABLE IF NOT EXISTS Authors (
        id INT PRIMARY KEY AUTO_INCREMENT,
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
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category_id INT NOT NULL,
        sub_category_id INT,
        author_id INT NOT NULL,
        image VARCHAR(255),
        video VARCHAR(255),
        published_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_featured BOOLEAN DEFAULT FALSE,
        headline_priority INT DEFAULT 0,
        headline_image_url VARCHAR(255),
        headline_video_url VARCHAR(255),
        is_trending BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE,
        FOREIGN KEY (sub_category_id) REFERENCES SubCategories(id) ON DELETE SET NULL,
        FOREIGN KEY (author_id) REFERENCES Authors(id) ON DELETE CASCADE
      )
    `);

    // Create Tags table
    await query(`
      CREATE TABLE IF NOT EXISTS Tags (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        color VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create ArticleTags junction table
    await query(`
      CREATE TABLE IF NOT EXISTS ArticleTags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES Tags(id) ON DELETE CASCADE
      )
    `);

    // Create Comments table
    await query(`
      CREATE TABLE IF NOT EXISTS Comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        article_id INT NOT NULL,
        user_id INT NOT NULL,
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
        id INT PRIMARY KEY AUTO_INCREMENT,
        article_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (article_id, user_id),
        FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    // Create Shares table
    await query(`
      CREATE TABLE IF NOT EXISTS Shares (
        id INT PRIMARY KEY AUTO_INCREMENT,
        article_id INT NOT NULL,
        user_id INT NOT NULL,
        platform VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    // Create Bookmarks table
    await query(`
      CREATE TABLE IF NOT EXISTS Bookmarks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        article_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_bookmark (article_id, user_id),
        FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    // Create Sponsors table
    await query(`
      CREATE TABLE IF NOT EXISTS Sponsors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        website_url VARCHAR(255),
        image_url VARCHAR(255),
        video_url VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    return { success: true, error: null };
  } catch (error) {
    console.error("Error setting up database:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
