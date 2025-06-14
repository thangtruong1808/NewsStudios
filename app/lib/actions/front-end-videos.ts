"use server";

import { query } from "../db/db";

export async function getVideosByArticleId(articleId: number) {
  try {
    console.log("Fetching videos for article ID:", articleId);

    const sqlQuery = `
      SELECT v.* 
      FROM Videos v
      WHERE v.article_id = ?
      ORDER BY v.created_at DESC
    `;

    const result = await query(sqlQuery, [articleId]);

    if (result.error) {
      console.error("Error fetching videos:", result.error);
      return { data: null, error: result.error };
    }

    console.log("Fetched videos:", result.data);
    return { data: result.data || [], error: null };
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { data: null, error: "Failed to fetch videos" };
  }
}
