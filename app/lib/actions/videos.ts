"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { RowDataPacket } from "mysql2";
import { Video } from "../definition";
import mysql from "mysql2/promise";
import { uploadToFTP } from "../utils/ftp";
import { getPublicIdFromUrl } from "../utils/cloudinaryUtils";
import { deleteVideoFromCloudinary } from "../utils/cloudinaryServerUtils";
import pool from "../db/query";

type VideoCountRow = {
  total: number;
} & Record<string, unknown>;

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
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
}

export async function getVideos(page: number = 1, itemsPerPage: number = 12) {
  try {
    const offset = (page - 1) * itemsPerPage;

    // Get total count with the same conditions as the main query
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM Videos v
      LEFT JOIN Articles a ON v.article_id = a.id
    `;
    const countResult = await query<VideoCountRow>(countQuery);

    // Get paginated videos with consistent ordering
    const sqlQuery = `
      SELECT v.*, a.title as article_title 
      FROM Videos v
      LEFT JOIN Articles a ON v.article_id = a.id
      ORDER BY v.created_at DESC, v.id DESC
      LIMIT ? OFFSET ?
    `;

    const result = await query<Video>(sqlQuery, [itemsPerPage, offset]);

    if (result.error) {
      return { data: null, error: result.error, totalItems: 0 };
    }

    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as VideoCountRow[])
      : [];
    const totalItems = countRows.length > 0 ? Number(countRows[0].total ?? 0) : 0;

    const videos = Array.isArray(result.data)
      ? (result.data as Video[])
      : [];

    return {
      data: videos,
      error: null,
      totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage),
    };
  } catch (error) {
    return { data: null, error: "Failed to fetch videos", totalItems: 0 };
  }
}

export async function getVideoById(id: number) {
  try {
    const result = await query(
      `SELECT v.*, a.title as article_title 
       FROM Videos v
       LEFT JOIN Articles a ON v.article_id = a.id
       WHERE v.id = ?`,
      [id]
    );

    if (result.error) {
      return { data: null, error: result.error };
    }

    return { data: result.data?.[0] || null, error: null };
  } catch (error) {
    console.error("Error fetching video:", error);
    return { data: null, error: "Failed to fetch video" };
  }
}

export async function createVideo(
  video: Omit<Video, "id" | "created_at" | "updated_at">
) {
  try {
    console.log("Creating video in database:", video);

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

    console.log("Database insert result:", result);

    if (result.error) {
      console.error("Database error:", result.error);
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/videos");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error creating video:", error);
    return { success: false, error: "Failed to create video" };
  }
}

export async function updateVideo(
  id: number,
  data: Partial<Video>
): Promise<boolean> {
  try {
    return await pool.transaction(async (client) => {
      // Get the old video details first
      const [oldVideo] = await client.query<mysql.RowDataPacket[]>(
        "SELECT * FROM Videos WHERE id = ?",
        [id]
      );

      if (!oldVideo || oldVideo.length === 0) {
        throw new Error("Video not found");
      }

      const oldVideoData = oldVideo[0] as Video;

      // Update the video in the database first
      const [result] = await client.query(
        "UPDATE Videos SET article_id = ?, video_url = ?, description = ? WHERE id = ?",
        [data.article_id, data.video_url || "", data.description || null, id]
      );

      if (!result || (result as mysql.ResultSetHeader).affectedRows === 0) {
        throw new Error("Failed to update video");
      }

      // If there's a new video URL and it's different from the old one, delete the old video asynchronously
      if (data.video_url && data.video_url !== oldVideoData.video_url) {
        if (
          oldVideoData.video_url &&
          oldVideoData.video_url.includes("cloudinary.com")
        ) {
          const oldPublicId = extractPublicId(oldVideoData.video_url);
          if (oldPublicId) {
            // Delete the old video asynchronously without waiting for the result
            deleteVideoFromCloudinary(oldPublicId).catch((error) => {
              console.error("Error deleting old video from Cloudinary:", error);
            });
          }
        }
      }

      revalidatePath("/dashboard/videos");
      return true;
    });
  } catch (error) {
    console.error("Error updating video:", error);
    throw error;
  }
}

export async function deleteVideo(id: number) {
  try {
    return await pool.transaction(async (client) => {
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
            const deleteResult = await deleteVideoFromCloudinary(publicId);
            if (!deleteResult.success) {
              console.error(
                "Failed to delete video from Cloudinary:",
                deleteResult.error
              );
              // Continue with database deletion even if Cloudinary deletion fails
            }
          } catch (error) {
            console.error("Error deleting video from Cloudinary:", error);
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
    console.error("Error deleting video:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete video",
    };
  }
}

export async function uploadVideoToServer(
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
      "INSERT INTO Videos (article_id, video_url, description, created_at) VALUES (?, ?, ?, NOW())",
      [article_id, url, description]
    );

    if (result.error) {
      return { error: result.error };
    }

    return { url };
  } catch (error) {
    console.error("Error uploading video:", error);
    return { error: "Failed to upload video" };
  }
}

export async function searchVideos(searchQuery: string) {
  try {
    const result = await query(
      `SELECT v.*, a.title as article_title 
       FROM Videos v
       LEFT JOIN Articles a ON v.article_id = a.id
       WHERE a.id LIKE ? OR a.title LIKE ? OR v.description LIKE ?
       ORDER BY v.created_at DESC`,
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
    );

    if (result.error) {
      return { data: [], error: result.error, totalItems: 0, totalPages: 0 };
    }

    const videos = result.data as Video[];
    return {
      data: videos,
      error: null,
      totalItems: videos.length,
      totalPages: 1,
    };
  } catch (error) {
    return {
      data: [],
      error: "Failed to search videos",
      totalItems: 0,
      totalPages: 0,
    };
  }
}
