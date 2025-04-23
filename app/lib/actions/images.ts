"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { ImageFormData } from "../validations/imageSchema";
import { uploadToFTP } from "../utils/ftpUpload";
import { uploadImageToCloudinary } from "../utils/cloudinaryServerUtils";
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
export async function uploadImageToServer(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const article_id = formData.get("article_id");
    const description = formData.get("description");

    if (!file) {
      return { error: "No file provided" };
    }

    // Log file details for debugging
    console.log("File details for upload:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Check if file is valid
    if (!file.type.startsWith("image/")) {
      return { error: "File must be an image" };
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { error: "File size must be less than 10MB" };
    }

    // Upload to Cloudinary instead of FTP
    console.log("Uploading image to Cloudinary...");
    const result = await uploadImageToCloudinary(file, "newshub_photos");

    if (!result.success) {
      console.error("Cloudinary upload error:", result.error);
      return { error: result.error || "Failed to upload image to Cloudinary" };
    }

    if (!result.url) {
      return { error: "Failed to get URL from Cloudinary upload" };
    }

    console.log("Image uploaded to Cloudinary successfully:", result.url);

    // Save to database - store the full Cloudinary URL
    const dbResult = await query(
      "INSERT INTO Images (article_id, image_url, description, created_at) VALUES (?, ?, ?, NOW())",
      [
        article_id ? parseInt(article_id.toString(), 10) : null,
        result.url, // Store the full Cloudinary URL
        description || null,
      ]
    );

    if (dbResult.error) {
      return { error: dbResult.error };
    }

    // Return the Cloudinary URL
    return { url: result.url };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
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

    // Process the images to ensure they have proper URLs
    const images = (result.data as ImageRow[]).map((image) => {
      // If the image_url is already a full URL (including Cloudinary URLs), use it as is
      if (
        image.image_url.startsWith("http://") ||
        image.image_url.startsWith("https://")
      ) {
        return image;
      }

      // For backward compatibility with old records that only store filenames
      // This will be phased out as we migrate to Cloudinary
      const fullUrl = `https://srv876-files.hstgr.io/3fd7426401e9c4d8/files/public_html/Images/${image.image_url}`;
      return {
        ...image,
        image_url: fullUrl,
      };
    });

    return { data: images, error: null };
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

export async function getImageData(filename: string): Promise<{
  data: string | null;
  error: string | null;
  useDirectUrl: boolean;
}> {
  if (!filename) {
    return { data: null, error: "Filename is required", useDirectUrl: true };
  }

  try {
    // Return just the filename with the Images path
    const imagePath = `Images/${filename}`;

    // Return the path
    return {
      data: imagePath,
      error: null,
      useDirectUrl: true,
    };
  } catch (error) {
    console.error(`Error preparing image data for ${filename}:`, error);
    return {
      data: null,
      error: "Failed to prepare image data",
      useDirectUrl: false,
    };
  }
}
