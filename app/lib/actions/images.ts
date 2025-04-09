"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { ImageFormData } from "../validations/imageSchema";
import { uploadFileViaFTP } from "../utils/ftpUpload";
import { connectToDatabase } from "../db";
import { uploadToFTP } from "../utils/ftpUpload";

interface ImageRecord {
  id: number;
  article_id: number | null;
  image_url: string;
  created_at: Date | string;
  updated_at: Date | string;
}

// Function to upload image to server and get the URL
export async function uploadImageToServer(
  file: File,
  article_id: number | null = null,
  description: string | null = null
) {
  try {
    // Upload to FTP server
    const { url, error } = await uploadToFTP(file);

    if (error) {
      return { error };
    }

    // Save to database
    const { db } = await connectToDatabase();

    const result = await db.execute(
      "INSERT INTO Images (article_id, image_url, description, created_at) VALUES (?, ?, ?, NOW())",
      [article_id, url, description]
    );

    return { url };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { error: "Failed to upload image" };
  }
}

// Function to create a new image record in the database
export async function createImage(data: ImageFormData) {
  try {
    const result = await query(
      "INSERT INTO Images (article_id, image_url) VALUES (?, ?)",
      [data.article_id, data.image_url]
    );

    revalidatePath("/dashboard/photos");

    // Return a serializable object instead of the raw database result
    return {
      data: {
        id: result[0]?.insertId || null,
        success: true,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error creating image:", error);
    return { data: null, error: "Failed to create image" };
  }
}

// Function to get all images
export async function getImages() {
  try {
    const { db } = await connectToDatabase();

    const [rows] = await db.execute(
      "SELECT * FROM Images ORDER BY created_at DESC"
    );

    return { data: rows };
  } catch (error) {
    console.error("Error fetching images:", error);
    return { data: [], error: "Failed to fetch images" };
  }
}

// Function to get an image by ID
export async function getImageById(id: number) {
  try {
    const [image] = await query("SELECT * FROM Images WHERE id = ?", [id]);

    if (!image) {
      return { data: null, error: "Image not found" };
    }

    // Convert the database result to a serializable format
    const serializableImage = {
      id: image.id,
      article_id: image.article_id,
      image_url: image.image_url,
      created_at:
        image.created_at instanceof Date
          ? image.created_at.toISOString()
          : image.created_at,
      updated_at:
        image.updated_at instanceof Date
          ? image.updated_at.toISOString()
          : image.updated_at,
    };

    return { data: serializableImage, error: null };
  } catch (error) {
    console.error("Error fetching image:", error);
    return { data: null, error: "Failed to fetch image" };
  }
}

// Function to update an image
export async function updateImage(id: number, data: ImageFormData) {
  try {
    await query(
      "UPDATE Images SET article_id = ?, image_url = ? WHERE id = ?",
      [data.article_id, data.image_url, id]
    );

    revalidatePath("/dashboard/photos");
    return { data: null, error: null };
  } catch (error) {
    console.error("Error updating image:", error);
    return { data: null, error: "Failed to update image" };
  }
}

// Function to delete an image
export async function deleteImage(id: number) {
  try {
    await query("DELETE FROM Images WHERE id = ?", [id]);

    revalidatePath("/dashboard/photos");
    return { data: null, error: null };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { data: null, error: "Failed to delete image" };
  }
}
