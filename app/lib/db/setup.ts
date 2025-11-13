"use server";

import { query } from "./query";

/**
 * Description: Initialize the NewsStudios MySQL schema.
 * Data created: Database my_database, core tables, indexes, and relations.
 * Author: thangtruong
 */
export async function setupDatabase() {
  try {
    // Database bootstrap
    //  Step 1: Create Database (if it doesn't exist)
    await query(`CREATE DATABASE IF NOT EXISTS newsstudio_db`);

    //  Step 2: Select the Database
    await query(`USE newsstudio_db`);

    //  Step 3: Create Users table
    await query(`
      CREATE TABLE IF NOT EXISTS Users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user', 'editor') NOT NULL DEFAULT 'user',
      user_image VARCHAR(255),
      description TEXT,
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email)  
      )
    `);

    //  Step 4: Create Categories table
    await query(`
      CREATE TABLE IF NOT EXISTS Categories (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_name (name) 
      )
    `);

    //  Step 5: Create SubCategories table
    await query(`
      CREATE TABLE IF NOT EXISTS SubCategories (
      id INT PRIMARY KEY AUTO_INCREMENT,
      category_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE,
      INDEX idx_category_id (category_id), 
      INDEX idx_name (name)  
      )
    `);

    //  Step 6: Create Authors table
    await query(`
      CREATE TABLE IF NOT EXISTS Authors (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      bio TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_name (name) 
      )
    `);
    
    //  Step 7: Create Articles table
    await query(`
      CREATE TABLE IF NOT EXISTS Articles (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      category_id INT,
      sub_category_id INT,
      author_id INT,
      user_id INT,
      image VARCHAR(255),
      video VARCHAR(255),
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_featured BOOLEAN DEFAULT FALSE,
      headline_priority INT DEFAULT 0,
      headline_image_url VARCHAR(255),
      headline_video_url VARCHAR(255),
      is_trending BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL,
      FOREIGN KEY (author_id) REFERENCES Authors(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL,
      INDEX idx_category_id (category_id),  
      INDEX idx_sub_category_id (sub_category_id),  
      INDEX idx_author_id (author_id),  
      INDEX idx_user_id (user_id),  
      INDEX idx_published_at (published_at) 
      )
    `);

    //  Step 8: Create Tags table
    await query(`
      CREATE TABLE IF NOT EXISTS Tags (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      color VARCHAR(50) NOT NULL,
      category_id INT,
      sub_category_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL,
      FOREIGN KEY (sub_category_id) REFERENCES SubCategories(id) ON DELETE SET NULL,
      INDEX idx_category_id (category_id),  
      INDEX idx_sub_category_id (sub_category_id),
      INDEX idx_name (name)  
      )
    `);

    //  Step 9: Create Article_Tags table
    await query(`
      CREATE TABLE IF NOT EXISTS Article_Tags (
      article_id INT NOT NULL,
      tag_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (article_id, tag_id),
      FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES Tags(id) ON DELETE CASCADE,
      INDEX idx_article_id (article_id),  
      INDEX idx_tag_id (tag_id)  
      )
    `);

    //  Step 10: Create Comments table
    await query(`
      CREATE TABLE IF NOT EXISTS Comments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      article_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
      INDEX idx_article_id (article_id),  
      INDEX idx_user_id (user_id)  
      )
    `);

    //  Step 11: Create Likes table
    await query(`
      CREATE TABLE IF NOT EXISTS Likes (
      id INT PRIMARY KEY AUTO_INCREMENT,
      article_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_like (article_id, user_id),
      FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
      INDEX idx_article_id (article_id), 
      INDEX idx_user_id (user_id)  
      )
    `);

    //  Step 12: Create Shares table
    await query(`
      CREATE TABLE IF NOT EXISTS Shares (
      id INT PRIMARY KEY AUTO_INCREMENT,
      article_id INT NOT NULL,
      user_id INT NOT NULL,
      platform VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
      INDEX idx_article_id (article_id),  
      INDEX idx_user_id (user_id)  
      )
    `);

    //  Step 13: Create Bookmarks table
    await query(`
      CREATE TABLE IF NOT EXISTS Bookmarks (
      id INT PRIMARY KEY AUTO_INCREMENT,
      article_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_bookmark (article_id, user_id),
      FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
      INDEX idx_article_id (article_id),  
      INDEX idx_user_id (user_id) 
      )
    `);

    //  Step 14: Create Images table
    await query(`
      CREATE TABLE IF NOT EXISTS Images (
      id INT PRIMARY KEY AUTO_INCREMENT,
      image_url VARCHAR(255) NOT NULL,
      article_id INT NULL,
      description TEXT,
      type ENUM('banner', 'video', 'thumbnail', 'gallery') NOT NULL,
      entity_type ENUM('advertisement', 'article', 'author', 'category') NOT NULL,
      entity_id INT NOT NULL,
      is_featured BOOLEAN DEFAULT FALSE,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_entity (entity_type, entity_id),  
      INDEX idx_type (type), 
      INDEX idx_article_id (article_id),  
      FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE SET NULL
      )
    `);

    //  Step 15: Create Videos table
    await query(`
      CREATE TABLE IF NOT EXISTS Videos (
      id INT PRIMARY KEY AUTO_INCREMENT,
     article_id INT NOT NULL,
      video_url VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
      INDEX idx_article_id (article_id) 
      )
    `);

    //  Step 16: Create Views table
    await query(`
      CREATE TABLE IF NOT EXISTS Views (
      id INT PRIMARY KEY AUTO_INCREMENT,
      article_id INT NOT NULL,
      user_id INT NULL,
      ip_address VARCHAR(45) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL,
      INDEX idx_article_id (article_id),  
      INDEX idx_user_id (user_id) 
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

