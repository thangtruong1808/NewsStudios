"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { Video } from "../../type/definitions";
import { uploadToFTP } from "../utils/ftp";

export async function getVideos() {
  try {
    // First try to get videos with article titles
    try {
      const result = await query(`
        SELECT v.*, a.title as article_title 
        FROM Videos v
        LEFT JOIN Articles a ON v.article_id = a.id
        ORDER BY v.created_at DESC
      `);

      if (result.error) {
        return { data: null, error: result.error };
      }

      return { data: result.data || [], error: null };
    } catch (joinError) {
      // If the join fails (e.g., Articles table doesn't exist), fall back to a simpler query
      console.warn(
        "Could not join with Articles table, falling back to basic query:",
        joinError
      );
      const result = await query(`
        SELECT v.*, NULL as article_title 
        FROM Videos v
        ORDER BY v.created_at DESC
      `);

      if (result.error) {
        return { data: null, error: result.error };
      }

      return { data: result.data || [], error: null };
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { data: null, error: "Failed to fetch videos" };
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
    const result = await query(
      `INSERT INTO Videos (article_id, video_url, description)
       VALUES (?, ?, ?)`,
      [video.article_id, video.video_url, video.description]
    );
    revalidatePath("/dashboard/videos");
    return { data: result, error: null };
  } catch (error) {
    console.error("Error creating video:", error);
    return { data: null, error: "Failed to create video" };
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
    return { data: result, error: null };
  } catch (error) {
    console.error("Error updating video:", error);
    return { data: null, error: "Failed to update video" };
  }
}

export async function deleteVideo(id: number) {
  try {
    const result = await query("DELETE FROM Videos WHERE id = ?", [id]);
    revalidatePath("/dashboard/videos");
    return { data: result, error: null };
  } catch (error) {
    console.error("Error deleting video:", error);
    return { data: null, error: "Failed to delete video" };
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
