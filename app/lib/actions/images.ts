"use server";

import { revalidatePath } from "next/cache";
import { query, transaction } from "../db/db";
import { ImageFormData } from "../validations/imageSchema";
import { uploadToFTP } from "../utils/ftpUpload";
import { uploadImageToCloudinary } from "../utils/cloudinaryServerUtils";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Image } from "../definition";

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
      `INSERT INTO Images (
        article_id, 
        image_url, 
        description, 
        type,
        entity_type,
        entity_id,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        article_id ? parseInt(article_id.toString(), 10) : null,
        result.url, // Store the full Cloudinary URL
        description || null,
        "gallery", // Default type for uploaded images
        "article", // Default entity type
        article_id ? parseInt(article_id.toString(), 10) : 0, // Use article_id as entity_id if available
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
export async function createImage(data: {
  url: string;
  alt_text?: string;
  type: "banner" | "video" | "thumbnail" | "gallery";
  entity_type: "advertisement" | "article" | "author" | "category";
  entity_id: number;
  is_featured?: boolean;
  display_order?: number;
}) {
  try {
    const result = await transaction(async (connection) => {
      const [rows] = await connection.execute(
        `INSERT INTO Images (
          url,
          alt_text,
          type,
          entity_type,
          entity_id,
          is_featured,
          display_order,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          data.url,
          data.alt_text || null,
          data.type,
          data.entity_type,
          data.entity_id,
          data.is_featured || false,
          data.display_order || 0,
        ]
      );
      return rows;
    });

    revalidatePath("/dashboard");
    return { success: true, id: (result as any).insertId };
  } catch (error) {
    console.error("Error creating image:", error);
    return { success: false, error: "Failed to create image" };
  }
}

// Function to get all images
export async function getImages(
  page: number = 1,
  limit: number = 12,
  searchQuery: string = ""
) {
  try {
    // Build the query with search
    let queryStr = `
      SELECT 
        i.id,
        i.article_id,
        i.image_url,
        i.description,
        i.type,
        i.entity_type,
        i.entity_id,
        i.is_featured,
        i.display_order,
        i.created_at,
        i.updated_at,
        a.title as article_title,
        a.slug as article_slug,
        COUNT(*) OVER() as total_count
      FROM Images i
      LEFT JOIN Articles a ON i.article_id = a.id
      WHERE 1=1
    `;
    const queryParams: any[] = [];

    if (searchQuery) {
      queryStr += ` AND (
        i.description LIKE ? OR
        a.title LIKE ?
      )`;
      queryParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    queryStr += ` ORDER BY i.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    console.log("Executing query:", {
      query: queryStr,
      params: queryParams,
    });

    const result = await query(queryStr, queryParams);
    console.log("Raw query result:", {
      success: !result.error,
      dataLength: result.data?.length,
      firstItem: result.data?.[0],
      error: result.error,
    });

    if (result.error) {
      console.error("Database error:", result.error);
      return {
        data: [],
        error: result.error,
        pagination: {
          total: 0,
          totalPages: 0,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    }

    // Get total count from the first row
    const total = result.data?.[0]?.total_count || 0;
    console.log("Total count from query:", total);

    // Process images to ensure they have proper URLs
    const processedImages = result.data?.map((img: any) => {
      // Ensure image_url is a full URL
      if (img.image_url && !img.image_url.startsWith("http")) {
        img.image_url = `${process.env.NEXT_PUBLIC_API_URL}${img.image_url}`;
      }
      return {
        id: img.id,
        article_id: img.article_id,
        image_url: img.image_url,
        description: img.description,
        type: img.type,
        entity_type: img.entity_type,
        entity_id: img.entity_id,
        is_featured: img.is_featured,
        display_order: img.display_order,
        created_at: img.created_at,
        updated_at: img.updated_at,
        article_title: img.article_title,
        article_slug: img.article_slug,
      };
    });

    console.log("Final processed images:", {
      count: processedImages?.length,
      firstImage: processedImages?.[0],
    });

    return {
      data: processedImages || [],
      error: null,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    console.error("Error in getImages:", error);
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch images",
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
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
export async function updateImage(id: number, data: Partial<Image>) {
  try {
    const result = await transaction(async (connection) => {
      // First, get the current image data
      const [currentImage] = await connection.execute(
        "SELECT * FROM Images WHERE id = ?",
        [id]
      );
      const image = (currentImage as any[])[0];

      if (!image) {
        throw new Error("Image not found");
      }

      // If entity_type is changing, verify the entity exists
      if (data.entity_type && data.entity_type !== image.entity_type) {
        let entityExists = false;
        switch (data.entity_type) {
          case "article":
            const [article] = await connection.execute(
              "SELECT id FROM Articles WHERE id = ?",
              [data.entity_id]
            );
            entityExists = (article as any[]).length > 0;
            break;
          case "advertisement":
            const [advertisement] = await connection.execute(
              "SELECT id FROM Advertisements WHERE id = ?",
              [data.entity_id]
            );
            entityExists = (advertisement as any[]).length > 0;
            break;
          case "author":
            const [author] = await connection.execute(
              "SELECT id FROM Authors WHERE id = ?",
              [data.entity_id]
            );
            entityExists = (author as any[]).length > 0;
            break;
          case "category":
            const [category] = await connection.execute(
              "SELECT id FROM Categories WHERE id = ?",
              [data.entity_id]
            );
            entityExists = (category as any[]).length > 0;
            break;
        }

        if (!entityExists) {
          throw new Error(`Referenced ${data.entity_type} does not exist`);
        }
      }

      // Update the image
      const [rows] = await connection.execute(
        `UPDATE Images 
         SET image_url = ?,
             description = ?,
             type = ?,
             entity_type = ?,
             entity_id = ?,
             is_featured = ?,
             display_order = ?,
             updated_at = NOW()
         WHERE id = ?`,
        [
          data.image_url,
          data.description,
          data.type,
          data.entity_type,
          data.entity_id,
          data.is_featured,
          data.display_order,
          id,
        ]
      );
      return rows;
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update image",
    };
  }
}

// Function to delete an image
export async function deleteImage(id: number) {
  try {
    const result = await transaction(async (connection) => {
      const [rows] = await connection.execute(
        `DELETE FROM Images WHERE id = ?`,
        [id]
      );
      return rows;
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, error: "Failed to delete image" };
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

export async function getImagesByEntity(
  entity_type: string,
  entity_id: number
) {
  try {
    const result = await query<Image>(
      `SELECT * FROM Images 
       WHERE entity_type = ? AND entity_id = ?
       ORDER BY display_order ASC, created_at DESC`,
      [entity_type, entity_id]
    );

    if (result.error) {
      return { data: null, error: result.error };
    }

    return { data: result.data || [], error: null };
  } catch (error) {
    console.error("Error fetching images:", error);
    return { data: null, error: "Failed to fetch images" };
  }
}

export async function getAllImages(type?: string) {
  try {
    let sql = `SELECT * FROM Images`;
    const params: any[] = [];

    if (type) {
      sql += ` WHERE type = ?`;
      params.push(type);
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await query<Image>(sql, params);

    if (result.error) {
      return { data: null, error: result.error };
    }

    return { data: result.data || [], error: null };
  } catch (error) {
    console.error("Error fetching all images:", error);
    return { data: null, error: "Failed to fetch images" };
  }
}

export async function searchImages(searchQuery: string) {
  try {
    const result = await query(
      `SELECT 
        i.id,
        i.article_id,
        i.image_url,
        i.description,
        i.type,
        i.entity_type,
        i.entity_id,
        i.is_featured,
        i.display_order,
        i.created_at,
        i.updated_at,
        a.title as article_title,
        a.slug as article_slug
       FROM Images i
       LEFT JOIN Articles a ON i.article_id = a.id
       WHERE i.description LIKE ? OR a.title LIKE ?
       ORDER BY i.created_at DESC`,
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );

    if (result.error) {
      return { data: [], error: result.error };
    }

    // Process images to ensure they have proper URLs
    const processedImages = result.data?.map((img: any) => {
      // Ensure image_url is a full URL
      if (img.image_url && !img.image_url.startsWith("http")) {
        img.image_url = `${process.env.NEXT_PUBLIC_API_URL}${img.image_url}`;
      }
      return {
        id: img.id,
        article_id: img.article_id,
        image_url: img.image_url,
        description: img.description,
        type: img.type,
        entity_type: img.entity_type,
        entity_id: img.entity_id,
        is_featured: img.is_featured,
        display_order: img.display_order,
        created_at: img.created_at,
        updated_at: img.updated_at,
        article_title: img.article_title,
        article_slug: img.article_slug,
      };
    });

    return {
      data: processedImages || [],
      error: null,
      pagination: {
        total: processedImages?.length || 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: processedImages?.length || 0,
      },
    };
  } catch (error) {
    return {
      data: [],
      error: "Failed to search images",
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0,
      },
    };
  }
}
