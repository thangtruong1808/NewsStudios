"use server";

import { query } from "@/app/lib/db/query";
import { Image } from "../definition";

export async function getImagesByArticleId(articleId: number) {
  try {
    const result = await query<Image>(
      `SELECT 
        i.id,
        i.image_url,
        i.description,
        i.created_at,
        i.type
      FROM Images i
      WHERE i.article_id = ? 
      ORDER BY 
        CASE 
          WHEN i.type = 'banner' THEN 1
          WHEN i.type = 'gallery' THEN 2
          ELSE 3
        END,
        i.created_at DESC`,
      [articleId]
    );

    if (result.error) {
      throw new Error(result.error);
    }

    return {
      data: result.data || [],
      error: null,
    };
  } catch (error) {
    console.error("Error fetching images by article ID:", error);
    return {
      data: null,
      error: "Failed to fetch images",
    };
  }
}
