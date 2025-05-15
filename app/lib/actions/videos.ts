"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { RowDataPacket } from "mysql2";
import { Video } from "../definition";
import mysql from "mysql2/promise";
import pool from "../db/db";
import { uploadToFTP } from "../utils/ftp";

export async function getVideos(page: number = 1, itemsPerPage: number = 12) {
  try {
    const offset = (page - 1) * itemsPerPage;

    // Get total count
    const countResult = await query("SELECT COUNT(*) as total FROM Videos");

    // Get paginated videos
    const sqlQuery = `
      SELECT v.*, a.title as article_title 
      FROM Videos v
      LEFT JOIN Articles a ON v.article_id = a.id
      ORDER BY v.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const result = await query(sqlQuery, [itemsPerPage, offset]);

    if (result.error) {
      return { data: null, error: result.error, totalItems: 0 };
    }

    const totalItems = countResult.data?.[0]?.total || 0;

    return {
      data: result.data || [],
      error: null,
      totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage),
    };
  } catch (error) {
    console.error("Error fetching videos:", error);
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

export async function updateVideo(id: number, video: Partial<Video>) {
  try {
    const result = await query(
      `UPDATE Videos 
       SET article_id = ?, video_url = ?, description = ?
       WHERE id = ?`,
      [video.article_id, video.video_url, video.description, id]
    );
    revalidatePath("/dashboard/videos");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating video:", error);
    return { success: false, error: "Failed to update video" };
  }
}

export async function deleteVideo(id: number) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // First, get the video details before deleting
    const [videoResult] = await connection.execute(
      "SELECT article_id, video_url FROM Videos WHERE id = ?",
      [id]
    );
    const video = (videoResult as any[])[0];

    if (!video) {
      await connection.rollback();
      return { data: null, error: "Video not found" };
    }

    // Check if this video is used as the main video in any article
    const [articleResult] = await connection.execute(
      "SELECT id FROM Articles WHERE video = ?",
      [video.video_url]
    );
    const article = (articleResult as any[])[0];

    // If this video is used as a main video, update the article to remove it
    if (article) {
      await connection.execute(
        "UPDATE Articles SET video = NULL WHERE id = ?",
        [article.id]
      );
    }

    // Now delete the video from the Videos table
    await connection.execute("DELETE FROM Videos WHERE id = ?", [id]);

    await connection.commit();
    revalidatePath("/dashboard/videos");
    return { data: { success: true }, error: null };
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting video:", error);
    return { data: null, error: "Failed to delete video" };
  } finally {
    connection.release();
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
       WHERE a.title LIKE ?
       ORDER BY v.created_at DESC`,
      [`%${searchQuery}%`]
    );

    if (result.error) {
      return { data: [], error: result.error };
    }

    return { data: result.data as Video[], error: null };
  } catch (error) {
    return { data: [], error: "Failed to search videos" };
  }
}
