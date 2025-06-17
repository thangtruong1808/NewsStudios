"use server";

import { query } from "../db/db";

export async function getFeaturedArticles(page: number = 1, limit: number = 8) {
  try {
    // Calculate offset for MySQL pagination
    const offset = (page - 1) * limit;

    const result = await query(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.color) as tag_colors,
        (SELECT COUNT(*) FROM Articles WHERE is_featured = 1 AND headline_priority = 0) as total_count
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
      LEFT JOIN Authors au ON a.author_id = au.id
      LEFT JOIN Article_Tags at ON a.id = at.article_id
      LEFT JOIN Tags t ON at.tag_id = t.id
      WHERE a.is_featured = 1 AND a.headline_priority = 0
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );

    if (!result.data || result.data.length === 0) {
      console.log("No featured articles found");
      return { data: [], totalCount: 0 };
    }

    const totalCount = result.data[0].total_count;
    const articles = result.data.map((article) => ({
      ...article,
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
      likes_count: article.likes_count || 0,
      comments_count: article.comments_count || 0,
      views_count: article.views_count || 0,
    }));

    return { data: articles, totalCount };
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return { error: "Failed to fetch featured articles" };
  }
}
