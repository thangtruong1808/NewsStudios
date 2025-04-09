"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { ImageFormData } from "../validations/imageSchema";
import { uploadToFTP } from "../utils/ftpUpload";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface ImageRow extends RowDataPacket {
  id: number;
  article_id: number | null;
  image_url: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
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
    const result = await query(
      "INSERT INTO Images (article_id, image_url, description, created_at) VALUES (?, ?, ?, NOW())",
      [article_id, url, description]
    );

    if (result.error) {
      return { error: result.error };
    }

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

    if (result.error) {
      return { data: null, error: result.error };
    }

    revalidatePath("/dashboard/photos");

    // Return a serializable object instead of the raw database result
    return {
      data: {
        id: (result.data as ResultSetHeader).insertId,
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
    const result = await query("SELECT * FROM Images ORDER BY created_at DESC");

    if (result.error) {
      return { data: [], error: result.error };
    }

    const images = result.data as ImageRow[];
    return {
      data: images.map((image) => ({
        id: image.id,
        article_id: image.article_id,
        image_url: image.image_url,
        description: image.description || undefined,
        created_at: image.created_at.toISOString(),
        updated_at: image.updated_at.toISOString(),
      })),
      error: null,
    };
  } catch (error) {
    console.error("Error fetching images:", error);
    return { data: [], error: "Failed to fetch images" };
  }
}

// Function to get a single image by ID
export async function getImageById(id: number) {
  try {
    const result = await query("SELECT * FROM Images WHERE id = ?", [id]);

    if (result.error) {
      return { data: null, error: result.error };
    }

    const images = result.data as ImageRow[];
    if (!images || images.length === 0) {
      return { data: null, error: "Image not found" };
    }

    const image = images[0];
    return {
      data: {
        id: image.id,
        article_id: image.article_id,
        image_url: image.image_url,
        description: image.description || undefined,
        created_at: image.created_at.toISOString(),
        updated_at: image.updated_at.toISOString(),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching image:", error);
    return { data: null, error: "Failed to fetch image" };
  }
}

// Function to update an image
export async function updateImage(id: number, data: ImageFormData) {
  try {
    const result = await query(
      "UPDATE Images SET article_id = ?, image_url = ? WHERE id = ?",
      [data.article_id, data.image_url, id]
    );

    if (result.error) {
      return { data: null, error: result.error };
    }

    revalidatePath("/dashboard/photos");
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error("Error updating image:", error);
    return { data: null, error: "Failed to update image" };
  }
}

// Function to delete an image
export async function deleteImage(id: number) {
  try {
    const result = await query("DELETE FROM Images WHERE id = ?", [id]);

    if (result.error) {
      return { data: null, error: result.error };
    }

    revalidatePath("/dashboard/photos");
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { data: null, error: "Failed to delete image" };
  }
}
