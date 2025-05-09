"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { ImageFormData } from "../validations/imageSchema";
import { uploadToFTP } from "../utils/ftpUpload";
import { uploadImageToCloudinary } from "../utils/cloudinaryServerUtils";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../db/db";

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
      article_id: article_id,
      description: description,
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

    console.log("Image uploaded to Cloudinary successfully:", {
      url: result.url,
      article_id: article_id,
      description: description,
    });

    // Log the URL before saving to database
    console.log("URL before database save:", {
      originalUrl: result.url,
      urlType: typeof result.url,
      urlLength: result.url.length,
      firstChar: result.url.charAt(0),
      lastChar: result.url.charAt(result.url.length - 1),
    });

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
      console.error("Database error:", dbResult.error);
      return { error: dbResult.error };
    }

    // Log the database result
    console.log("Database save result:", {
      success: !dbResult.error,
      article_id: article_id,
      image_url: result.url,
      dbResult: dbResult.data,
    });

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
export async function getImages(articleId?: number) {
  try {
    let sqlQuery = "SELECT * FROM Images";
    const values: any[] = [];

    if (articleId) {
      sqlQuery += " WHERE article_id = ?";
      values.push(articleId);
    }

    sqlQuery += " ORDER BY created_at DESC";

    const result = await query(sqlQuery, values);

    if (result.error) {
      console.error("Error in getImages:", result.error);
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
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // First, get the image details before deleting
    const [imageResult] = await connection.execute(
      "SELECT article_id, image_url FROM Images WHERE id = ?",
      [id]
    );
    const image = (imageResult as any[])[0];

    if (!image) {
      await connection.rollback();
      return { data: null, error: "Image not found" };
    }

    // Check if this image is used as the main image in any article
    const [articleResult] = await connection.execute(
      "SELECT id FROM Articles WHERE image = ?",
      [image.image_url]
    );
    const article = (articleResult as any[])[0];

    // If this image is used as a main image, update the article to remove it
    if (article) {
      await connection.execute(
        "UPDATE Articles SET image = NULL WHERE id = ?",
        [article.id]
      );
    }

    // Now delete the image from the Images table
    await connection.execute("DELETE FROM Images WHERE id = ?", [id]);

    await connection.commit();
    revalidatePath("/dashboard/photos");
    return { data: { success: true }, error: null };
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting image:", error);
    return { data: null, error: "Failed to delete image" };
  } finally {
    connection.release();
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
