"use server";

import { query } from "../db/db";

export async function getVideosByArticleId(articleId: number) {
  try {
    const sqlQuery = `
      SELECT v.* 
      FROM Videos v
      WHERE v.article_id = ?
      ORDER BY v.created_at DESC
    `;

    const result = await query(sqlQuery, [articleId]);

    if (result.error) {
      return { data: null, error: result.error };
    }

    return { data: result.data || [], error: null };
  } catch (_error) {
    return { data: null, error: "Failed to fetch videos" };
  }
}

export async function getAllVideos() {
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
  } catch (_error) {
    return { data: null, error: "Failed to fetch videos" };
  }
}
