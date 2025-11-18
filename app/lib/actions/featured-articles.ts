"use server";

// Component Info
// Description: Server action fetching featured articles with pagination and metadata.
// Date created: 2025-11-18
// Author: thangtruong

import { query } from "../db/query";
import { resolveTableName } from "../db/tableNameResolver";

type FeaturedArticleRow = {
  total_count: number;
  tag_names?: string | null;
  tag_colors?: string | null;
  likes_count?: number | null;
  comments_count?: number | null;
  views_count?: number | null;
} & Record<string, unknown>;

export async function getFeaturedArticles(page: number = 1, limit: number = 8) {
  try {
    // Resolve table names with proper casing
    const [articlesTable, categoriesTable, subcategoriesTable, authorsTable, articleTagsTable, tagsTable] = await Promise.all([
      resolveTableName("Articles"),
      resolveTableName("Categories"),
      resolveTableName("SubCategories"),
      resolveTableName("Authors"),
      resolveTableName("Article_Tags"),
      resolveTableName("Tags"),
    ]);

    // Validate table names are resolved
    if (!articlesTable || !categoriesTable || !subcategoriesTable || !authorsTable || !articleTagsTable || !tagsTable) {
      return { data: [], totalCount: 0, error: "Failed to resolve table names." };
    }

    // Calculate offset for MySQL pagination
    const limitValue = Math.max(1, Number(limit) || 8);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;

    const result = await query(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.color) as tag_colors,
        (SELECT COUNT(*) FROM \`${articlesTable}\` WHERE is_featured = 1 AND headline_priority = 0) as total_count
      FROM \`${articlesTable}\` a
      LEFT JOIN \`${categoriesTable}\` c ON a.category_id = c.id
      LEFT JOIN \`${subcategoriesTable}\` sc ON a.sub_category_id = sc.id
      LEFT JOIN \`${authorsTable}\` au ON a.author_id = au.id
      LEFT JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
      LEFT JOIN \`${tagsTable}\` t ON at.tag_id = t.id
      WHERE a.is_featured = 1 AND a.headline_priority = 0
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `
    );

    const rows = Array.isArray(result.data)
      ? (result.data as FeaturedArticleRow[])
      : [];

    if (rows.length === 0) {
      return { data: [], totalCount: 0, error: null };
    }

    const totalCount = rows[0].total_count ?? 0;
    const articles = rows.map((article) => ({
      ...article,
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
      likes_count: Number(article.likes_count ?? 0),
      comments_count: Number(article.comments_count ?? 0),
      views_count: Number(article.views_count ?? 0),
    }));

    return { data: articles, totalCount, error: null };
  } catch (_error) {
    return { data: [], totalCount: 0, error: "Failed to fetch featured articles" };
  }
}
