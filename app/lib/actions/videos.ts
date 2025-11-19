"use server";

// Component Info
// Description: Server actions for video CRUD operations and queries.
// Date created: 2025-11-18
// Author: thangtruong

import { revalidatePath } from "next/cache";
import { query } from "../db/query";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Video } from "../definition";
import { uploadToFTP } from "../utils/ftp";
import { deleteVideoFromCloudinary } from "../utils/cloudinaryServerUtils";
import { transaction } from "../db/query";
import { resolveTableName } from "../db/tableNameResolver";

type VideoCountRow = {
  total: number;
} & Record<string, unknown>;

type VideoRow = {
  id?: number | string;
  article_id?: number | string | null;
  video_url?: string | null;
  description?: string | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
  article_title?: string | null;
};

const normalizeDate = (value: unknown): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
    return String(value);
  }
  return "";
};

const normalizeVideo = (video: VideoRow): Video => ({
  id: Number(video.id ?? 0),
  article_id: Number(video.article_id ?? 0),
  video_url:
    typeof video.video_url === "string" && video.video_url.length > 0
      ? video.video_url
      : undefined,
  description:
    typeof video.description === "string" && video.description.length > 0
      ? video.description
      : undefined,
  created_at: normalizeDate(video.created_at),
  updated_at: normalizeDate(video.updated_at),
  article_title:
    typeof video.article_title === "string" ? video.article_title : undefined,
});

// Helper function to extract public ID from Cloudinary URL
function extractPublicId(url: string): string | null {
  try {
    // For URLs like: https://res.cloudinary.com/difsfoku4/video/upload/v1747736859/newshub_photos/491506839_9170892416350089_8889553899704583763_n_tyep7a.mp4
    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
      // Get everything after 'upload/v{version}/' and before the file extension
      const publicIdParts = urlParts.slice(uploadIndex + 2);
      const lastPart = publicIdParts[publicIdParts.length - 1];
      return lastPart.split(".")[0];
    }

    return null;
  } catch (_error) {
    return null;
  }
}

export async function getVideos(page: number = 1, itemsPerPage: number = 12) {
  try {
    // Resolve table names with proper casing - with fallback to preferred names
    let videosTable: string;
    let articlesTable: string;

    try {
      const resolvedTables = await Promise.all([
        resolveTableName("Videos"),
        resolveTableName("Articles"),
      ]);
      videosTable = resolvedTables[0] || "Videos";
      articlesTable = resolvedTables[1] || "Articles";
    } catch (_resolveError) {
      // Fallback to preferred names if resolution fails
      videosTable = "Videos";
      articlesTable = "Articles";
    }

    const safePage = Number.isFinite(page) && page > 0 ? Number(page) : 1;
    const safeLimit =
      Number.isFinite(itemsPerPage) && itemsPerPage > 0
        ? Number(itemsPerPage)
        : 12;
    const offset = (safePage - 1) * safeLimit;

    // Get total count with the same conditions as the main query
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM \`${videosTable}\` v
      LEFT JOIN \`${articlesTable}\` a ON v.article_id = a.id
    `;
    const countResult = await query<VideoCountRow>(countQuery);

    // Get paginated videos with consistent ordering
    const sqlQuery = `
      SELECT v.*, a.title as article_title 
      FROM \`${videosTable}\` v
      LEFT JOIN \`${articlesTable}\` a ON v.article_id = a.id
      ORDER BY v.created_at DESC, v.id DESC
      LIMIT ${safeLimit} OFFSET ${offset}
    `;

    const result = await query<VideoRow>(sqlQuery);

    // Check for count query errors
    if (countResult.error || !countResult.data) {
      return {
        data: [],
        error: null,
        totalItems: 0,
      };
    }

    // Check for query errors
    if (result.error || !result.data) {
      return {
        data: [],
        error: null,
        totalItems: 0,
      };
    }

    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as VideoCountRow[])
      : [];
    const totalItems = countRows.length > 0 ? Number(countRows[0].total ?? 0) : 0;

    const videoRows = Array.isArray(result.data)
      ? (result.data as VideoRow[])
      : [];
    const videos = videoRows.map(normalizeVideo);

    return {
      data: videos,
      error: null,
      totalItems,
      totalPages: totalItems > 0 ? Math.ceil(totalItems / safeLimit) : 1,
    };
  } catch (error) {
    // For all errors, return empty data without error to prevent toast
    // Empty table scenarios should not trigger error toasts
    return { data: [], error: null, totalItems: 0 };
  }
}

export async function getVideoById(id: number) {
  try {
    const result = await query<VideoRow>(
      `SELECT v.*, a.title as article_title 
       FROM Videos v
       LEFT JOIN Articles a ON v.article_id = a.id
       WHERE v.id = ?`,
      [id]
    );

    if (result.error) {
      return { data: null, error: result.error };
    }

    const rows = Array.isArray(result.data)
      ? (result.data as VideoRow[])
      : [];
    const video = rows[0];

    if (!video) {
      return { data: null, error: "Video not found" };
    }

    return { data: normalizeVideo(video), error: null };
  } catch (_error) {
    return { data: null, error: "Failed to fetch video" };
  }
}

export async function createVideo(
  video: Omit<Video, "id" | "created_at" | "updated_at">
) {
  try {
    if (!video.article_id) {
      throw new Error("Article ID is required");
    }

    if (!video.video_url) {
      throw new Error("Video URL is required");
    }

    // Convert undefined to null for SQL
    const description =
      video.description === undefined ? null : video.description;

    const result = await query(
      `INSERT INTO Videos (article_id, video_url, description)
       VALUES (?, ?, ?)`,
      [video.article_id, video.video_url, description]
    );

    if (result.error) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/videos");
    return { success: true, error: null };
  } catch (_error) {
    return { success: false, error: "Failed to create video" };
  }
}

export async function updateVideo(
  id: number,
  data: Partial<Video>
): Promise<boolean> {
  try {
    return transaction(async (client) => {
      // Get the old video details first
      const [oldVideo] = await client.query<RowDataPacket[]>(
        "SELECT * FROM Videos WHERE id = ?",
        [id]
      );

      if (!oldVideo || oldVideo.length === 0) {
        throw new Error("Video not found");
      }

      const oldVideoData = oldVideo[0] as Video;

      // Update the video in the database first
      const nextArticleId =
        data.article_id ?? oldVideoData.article_id ?? null;
      const nextVideoUrl = data.video_url ?? oldVideoData.video_url ?? "";
      const nextDescription =
        data.description !== undefined
          ? data.description
          : oldVideoData.description ?? null;

      const [result] = await client.query<ResultSetHeader>(
        "UPDATE Videos SET article_id = ?, video_url = ?, description = ? WHERE id = ?",
        [nextArticleId, nextVideoUrl, nextDescription, id]
      );

      if (!result || result.affectedRows === 0) {
        throw new Error("Failed to update video");
      }

      // If there's a new video URL and it's different from the old one, delete the old video asynchronously
      if (
        data.video_url &&
        data.video_url !== oldVideoData.video_url &&
        oldVideoData.video_url &&
        oldVideoData.video_url.includes("cloudinary.com")
      ) {
        const oldPublicId = extractPublicId(oldVideoData.video_url);
        if (oldPublicId) {
          deleteVideoFromCloudinary(oldPublicId).catch(() => null);
        }
      }

      revalidatePath("/dashboard/videos");
      return true;
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteVideo(id: number) {
  try {
    return transaction(async (client) => {
      // First, get the video details before deleting
      const [videoResult] = await client.execute(
        "SELECT article_id, video_url FROM Videos WHERE id = ?",
        [id]
      );
      const video = (videoResult as any[])[0];

      if (!video) {
        throw new Error("Video not found");
      }

      // Check if this video is used as the main video in any article
      const [articleResult] = await client.execute(
        "SELECT id FROM Articles WHERE video = ?",
        [video.video_url]
      );
      const article = (articleResult as any[])[0];

      // If this video is used as a main video, update the article to remove it
      if (article) {
        await client.execute("UPDATE Articles SET video = NULL WHERE id = ?", [
          article.id,
        ]);
      }

      // Delete from Cloudinary if it's a Cloudinary URL
      if (video.video_url && video.video_url.includes("cloudinary.com")) {
        const publicId = extractPublicId(video.video_url);
        if (publicId) {
          try {
            await deleteVideoFromCloudinary(publicId);
          } catch (_error) {
            // Continue with database deletion even if Cloudinary deletion fails
          }
        }
      }

      // Now delete the video from the Videos table
      const [deleteResult] = await client.execute(
        "DELETE FROM Videos WHERE id = ?",
        [id]
      );

      if (!deleteResult || (deleteResult as any).affectedRows === 0) {
        throw new Error("Failed to delete video from database");
      }

      revalidatePath("/dashboard/videos");
      return { success: true, error: null };
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete video",
    };
  }
}

export async function uploadVideoToServer(
  file: File,
  article_id: number | null,
  description: string | null = null
): Promise<{ url?: string; error?: string }> {
  try {
    // Upload to FTP server
    const { url, error } = await uploadToFTP(file);

    if (error) {
      return { error };
    }

    const normalizedUrl = url ?? undefined;

    if (!normalizedUrl) {
      return { error: "Video uploaded but URL was not returned." };
    }

    // Save to database
    const result = await query(
      "INSERT INTO Videos (article_id, video_url, description, created_at) VALUES (?, ?, ?, NOW())",
      [article_id, normalizedUrl, description ?? null]
    );

    if (result.error) {
      return { error: result.error };
    }

    return { url: normalizedUrl };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to upload video",
    };
  }
}

export async function searchVideos(searchQuery: string) {
  try {
    // Resolve table names with proper casing - with fallback to preferred names
    let videosTable: string;
    let articlesTable: string;

    try {
      const resolvedTables = await Promise.all([
        resolveTableName("Videos"),
        resolveTableName("Articles"),
      ]);
      videosTable = resolvedTables[0] || "Videos";
      articlesTable = resolvedTables[1] || "Articles";
    } catch (_resolveError) {
      // Fallback to preferred names if resolution fails
      videosTable = "Videos";
      articlesTable = "Articles";
    }

    // Convert search query to number if it's numeric for article_id search
    const searchTerm = searchQuery.trim();
    const isNumeric = /^\d+$/.test(searchTerm);
    const articleIdCondition = isNumeric ? `a.id = ?` : `CAST(a.id AS CHAR) LIKE ?`;
    const articleIdParam = isNumeric ? Number(searchTerm) : `%${searchTerm}%`;

    const result = await query<VideoRow>(
      `SELECT v.*, a.title as article_title 
       FROM \`${videosTable}\` v
       LEFT JOIN \`${articlesTable}\` a ON v.article_id = a.id
       WHERE ${articleIdCondition} OR a.title LIKE ? OR v.description LIKE ?
       ORDER BY v.created_at DESC`,
      [articleIdParam, `%${searchTerm}%`, `%${searchTerm}%`]
    );

    if (result.error) {
      return { data: [], error: result.error, totalItems: 0, totalPages: 0 };
    }

    const videoRows = Array.isArray(result.data)
      ? (result.data as VideoRow[])
      : [];
    const videos = videoRows.map(normalizeVideo);
    return {
      data: videos,
      error: null,
      totalItems: videos.length,
      totalPages: 1,
    };
  } catch (_error) {
    return {
      data: [],
      error: "Failed to search videos",
      totalItems: 0,
      totalPages: 0,
    };
  }
}
