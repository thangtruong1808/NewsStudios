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
export async function uploadImageToServer(file: File) {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function to create a new image record in the database
export async function createImage(data: {
  image_url: string;
  description?: string;
  type: "banner" | "video" | "thumbnail" | "gallery";
  entity_type: "advertisement" | "article" | "author" | "category";
  entity_id: number;
  is_featured?: boolean;
  display_order?: number;
  article_id?: number | null;
}) {
  try {
    const result = await transaction(async (connection) => {
      const [rows] = await connection.execute(
        `INSERT INTO Images (
          image_url,
          description,
          type,
          entity_type,
          entity_id,
          article_id,
          is_featured,
          display_order,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          data.image_url,
          data.description || null,
          data.type,
          data.entity_type,
          data.entity_id,
          data.article_id || null,
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
export async function getImages({
  page = 1,
  limit = 10,
  sortField = "created_at",
  sortDirection = "desc",
  searchQuery = "",
}: {
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  searchQuery?: string;
}) {
  try {
    const offset = (page - 1) * limit;
    let queryStr = `
      SELECT i.*, a.title as article_title
      FROM Images i
      LEFT JOIN Articles a ON i.article_id = a.id
    `;

    const queryParams: any[] = [];

    if (searchQuery) {
      queryStr += `
        WHERE i.description LIKE ? 
        OR a.title LIKE ?
      `;
      const searchParam = `%${searchQuery}%`;
      queryParams.push(searchParam, searchParam);
    }

    queryStr += `
      ORDER BY i.${sortField} ${sortDirection}
      LIMIT ? OFFSET ?
    `;
    queryParams.push(limit, offset);

    const result = await query(queryStr, queryParams);
    const countResult = await query(
      "SELECT COUNT(*) as total FROM Images" +
        (searchQuery ? " WHERE description LIKE ?" : ""),
      searchQuery ? [`%${searchQuery}%`] : []
    );

    if (result.error || countResult.error) {
      throw new Error(result.error || countResult.error);
    }

    const total = countResult.data?.[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      images: result.data || [],
      totalPages,
      totalItems: total,
    };
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
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
             article_id = ?,
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
          data.entity_type === "article" ? data.entity_id : null,
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
       WHERE a.id LIKE ? OR a.title LIKE ? OR i.description LIKE ?
       ORDER BY i.created_at DESC`,
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
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
