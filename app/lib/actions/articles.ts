"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/db";

export interface Article {
  id: number;
  title: string;
  content: string;
  author_id: number;
  category_id: number;
  published_at: Date;
  updated_at: Date;
}

export async function getArticles() {
  try {
    const result = await query(`
      SELECT a.*, c.name as category_name, au.name as author_name
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN Authors au ON a.author_id = au.id
      ORDER BY a.published_at DESC
    `);

    if (result.error) {
      console.error("Error in getArticles:", result.error);
      return { error: result.error };
    }

    return { data: result.data || [] };
  } catch (error) {
    console.error("Error in getArticles:", error);
    try {
      // Fallback to simpler query if join fails
      const fallbackResult = await query(
        "SELECT * FROM Articles ORDER BY published_at DESC"
      );

      if (fallbackResult.error) {
        console.error("Error in getArticles fallback:", fallbackResult.error);
        return { error: fallbackResult.error };
      }

      return { data: fallbackResult.data || [] };
    } catch (fallbackError) {
      console.error("Error in getArticles fallback:", fallbackError);
      return { error: "Failed to fetch articles" };
    }
  }
}

export async function getArticleById(id: number) {
  try {
    const result = await query(
      `
      SELECT a.*, c.name as category_name, au.name as author_name
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN Authors au ON a.author_id = au.id
      WHERE a.id = ?
    `,
      [id]
    );

    if (result.error) {
      console.error("Error fetching article:", result.error);
      return { data: null, error: result.error };
    }

    return { data: result.data?.[0] || null, error: null };
  } catch (error) {
    console.error("Error fetching article:", error);
    return { data: null, error: "Failed to fetch article" };
  }
}

interface CreateArticleData {
  title: string;
  content: string;
  category_id: number;
  author_id: number;
  sub_category_id?: number;
  image?: string;
  video?: string;
  is_featured?: boolean;
  headline_priority?: number;
  headline_image_url?: string;
  headline_video_url?: string;
  is_trending?: boolean;
}

export async function createArticle(data: CreateArticleData) {
  try {
    const result = await query(
      `INSERT INTO Articles (
        title, content, category_id, author_id, sub_category_id,
        image, video, is_featured, headline_priority,
        headline_image_url, headline_video_url, is_trending
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.content,
        data.category_id,
        data.author_id,
        data.sub_category_id || null,
        data.image || null,
        data.video || null,
        data.is_featured || false,
        data.headline_priority || null,
        data.headline_image_url || null,
        data.headline_video_url || null,
        data.is_trending || false,
      ]
    );

    revalidatePath("/dashboard/articles");
    return { data: result };
  } catch (error) {
    console.error("Error in createArticle:", error);
    return { error: "Failed to create article" };
  }
}
