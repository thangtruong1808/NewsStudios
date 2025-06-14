"use server";

import { query } from "../db/db";
import { Article } from "../definition";

export async function getHighlightArticles({
  page = 1,
  itemsPerPage = 6,
}: {
  page?: number;
  itemsPerPage?: number;
} = {}) {
  try {
    const offset = (page - 1) * itemsPerPage;

    const { data, error } = await query(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        CONCAT(u.firstname, ' ', u.lastname) as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.id) as tag_ids,
        GROUP_CONCAT(t.color) as tag_colors,
        (SELECT COUNT(*) FROM Likes WHERE article_id = a.id) as likes_count,
        (SELECT COUNT(*) FROM Comments WHERE article_id = a.id) as comments_count,
        (SELECT COUNT(*) FROM Articles WHERE headline_priority != 0) as total_count
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
      LEFT JOIN Users u ON a.user_id = u.id
      LEFT JOIN Article_Tags at ON a.id = at.article_id
      LEFT JOIN Tags t ON at.tag_id = t.id
      WHERE a.headline_priority != 0
      GROUP BY a.id, c.name, sc.name, u.firstname, u.lastname
      ORDER BY a.headline_priority DESC, a.published_at DESC
      LIMIT ? OFFSET ?
    `,
      [itemsPerPage, offset]
    );

    if (error) {
      console.error("Error in getHighlightArticles:", error);
      return { data: [], error, totalCount: 0 };
    }

    // Transform the data to ensure all required fields are present
    const articles = Array.isArray(data)
      ? data.map((article: any) => ({
          ...article,
          published_at: new Date(article.published_at),
          updated_at: new Date(article.updated_at),
          is_featured: Boolean(article.is_featured),
          is_trending: Boolean(article.is_trending),
          headline_priority: Number(article.headline_priority),
          tag_names: article.tag_names ? article.tag_names.split(",") : [],
          tag_ids: article.tag_ids
            ? article.tag_ids.split(",").map(Number)
            : [],
          tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
          likes_count: Number(article.likes_count) || 0,
          comments_count: Number(article.comments_count) || 0,
          views_count: 0, // Set default value since Views table doesn't exist
        }))
      : [];

    const totalCount = data?.[0]?.total_count || 0;
    return { data: articles, error: null, totalCount };
  } catch (error) {
    console.error("Error in getHighlightArticles:", error);
    return {
      data: [],
      error: "Failed to fetch highlight articles",
      totalCount: 0,
    };
  }
}
