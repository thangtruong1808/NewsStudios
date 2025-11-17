"use server";

import { revalidatePath } from "next/cache";
import { query, transaction } from "../db/db";
import { RowDataPacket } from "mysql2";
import { Image } from "../definition";

interface ImageRow extends RowDataPacket {
  id: number;
  article_id: number | null;
  image_url: string;
  description: string | null;
  type: Image["type"];
  entity_type: Image["entity_type"];
  entity_id: number | null;
  is_featured: boolean | 0 | 1;
  display_order: number | null;
  created_at: Date | string;
  updated_at: Date | string;
  article_title?: string | null;
  article_slug?: string | null;
}

type ImageCountRow = {
  total: number;
} & Record<string, unknown>;

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
    const insertResult = await transaction(async (connection) => {
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
    return { success: true, id: (insertResult as any).insertId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create image",
    };
  }
}

// Function to get all images
const IMAGE_SORT_FIELDS = new Set([
  "created_at",
  "updated_at",
  "description",
  "type",
  "entity_type",
  "entity_id",
  "display_order",
]);

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
    const safePage = Number.isFinite(page) && page > 0 ? Number(page) : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Number(limit) : 10;
    const offset = (safePage - 1) * safeLimit;
    const safeSortField = IMAGE_SORT_FIELDS.has(sortField ?? "")
      ? (sortField as string)
      : "created_at";
    const safeDirection = sortDirection === "asc" ? "ASC" : "DESC";
    const trimmedSearch = searchQuery.trim();
    const baseSelect = `
      SELECT i.*, a.title as article_title
      FROM Images i
      LEFT JOIN Articles a ON i.article_id = a.id
    `;
    const baseCount = `
      SELECT COUNT(*) as total
      FROM Images i
      LEFT JOIN Articles a ON i.article_id = a.id
    `;
    const whereClause = trimmedSearch
      ? `
        WHERE i.description LIKE ?
        OR a.title LIKE ?
      `
      : "";
    const searchParams = trimmedSearch
      ? [`%${trimmedSearch}%`, `%${trimmedSearch}%`]
      : [];

    const queryStr = `
      ${baseSelect}
      ${whereClause}
      ORDER BY i.${safeSortField} ${safeDirection}
      LIMIT ${safeLimit} OFFSET ${offset}
    `;

    const countQuery = `
      ${baseCount}
      ${whereClause}
    `;

    const result = await query<ImageRow>(queryStr, searchParams);
    const countResult = await query<ImageCountRow>(countQuery, searchParams);

    if (result.error || countResult.error) {
      throw new Error(
        result.error || countResult.error || "An unknown error occurred"
      );
    }

    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as ImageCountRow[])
      : [];
    const total = countRows.length > 0 ? Number(countRows[0].total ?? 0) : 0;
    const totalPages = total > 0 ? Math.ceil(total / safeLimit) : 1;

    const rows = Array.isArray(result.data)
      ? (result.data as ImageRow[])
      : [];

    const images: Image[] = rows.map((row) => ({
      id: row.id,
      article_id: row.article_id,
      image_url: row.image_url,
      description: row.description ?? null,
      type: row.type,
      entity_type: row.entity_type,
      entity_id: Number(row.entity_id ?? 0),
      is_featured: Boolean(row.is_featured),
      display_order: Number(row.display_order ?? 0),
      created_at:
        row.created_at instanceof Date
          ? row.created_at.toISOString()
          : new Date(row.created_at).toISOString(),
      updated_at:
        row.updated_at instanceof Date
          ? row.updated_at.toISOString()
          : new Date(row.updated_at).toISOString(),
      article_title: row.article_title ?? undefined,
      article_slug: row.article_slug ?? undefined,
    }));

    return {
      images,
      totalPages,
      totalItems: total,
    };
  } catch (_error) {
    throw _error;
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
    const createdAt =
      image.created_at instanceof Date
        ? image.created_at
        : new Date(image.created_at);
    const updatedAt =
      image.updated_at instanceof Date
        ? image.updated_at
        : new Date(image.updated_at);
    return {
      data: {
        id: image.id,
        article_id: image.article_id,
        image_url: image.image_url,
        description: image.description || undefined,
        created_at: createdAt.toISOString(),
        updated_at: updatedAt.toISOString(),
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch image",
    };
  }
}

// Function to update an image
export async function updateImage(id: number, data: Partial<Image>) {
  try {
    await transaction(async (connection) => {
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
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update image",
    };
  }
}

// Function to delete an image
export async function deleteImage(id: number) {
  try {
    const deleteResult = await transaction(async (connection) => {
      const [rows] = await connection.execute(
        `DELETE FROM Images WHERE id = ?`,
        [id]
      );
      return rows;
    });

    revalidatePath("/dashboard");
    const affectedRows = (deleteResult as any).affectedRows ?? 0;
    return {
      success: affectedRows > 0,
      error: affectedRows > 0 ? null : "Image not found",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
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
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to prepare image data",
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
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch images",
    };
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
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch images",
    };
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
