"use server";

import { query } from "../db/db";
import { Article } from "../definition";

export async function getFrontEndArticles({ type }: { type?: string } = {}) {
  try {
    const result = await query(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.color) as tag_colors,
        (SELECT COUNT(*) FROM Likes WHERE article_id = a.id) as likes_count,
        (SELECT COUNT(*) FROM Comments WHERE article_id = a.id) as comments_count,
        (SELECT COUNT(*) FROM Articles WHERE 1=1 ${
          type === "trending" ? "AND is_trending = 1" : ""
        }) as total_count
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
      LEFT JOIN Authors au ON a.author_id = au.id
      LEFT JOIN Article_Tags at ON a.id = at.article_id
      LEFT JOIN Tags t ON at.tag_id = t.id
      WHERE 1=1
      ${type === "trending" ? "AND a.is_trending = 1" : ""}
      GROUP BY a.id
      ORDER BY a.published_at DESC
    `
    );

    if (!result.data || result.data.length === 0) {
      console.log("No articles found");
      return { data: [] };
    }

    const articles = result.data.map((article) => ({
      ...article,
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
      likes_count: Number(article.likes_count) || 0,
      comments_count: Number(article.comments_count) || 0,
      views_count: 0, // Set default value since Views table doesn't exist
    }));

    return { data: articles };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { error: "Failed to fetch articles" };
  }
}
