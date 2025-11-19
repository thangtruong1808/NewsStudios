"use server";

// Component Info
// Description: Server action for searching articles by title, categories, and subcategories.
// Date created: 2025-01-27
// Author: thangtruong

import { query } from "../db/query";
import { resolveTableName } from "../db/tableNameResolver";

interface SearchArticlesParams {
  search?: string;
  categoryIds?: number[];
  subcategoryIds?: number[];
  page?: number;
  limit?: number;
}

export async function searchArticles({
  search = "",
  categoryIds = [],
  subcategoryIds = [],
  page = 1,
  limit = 20,
}: SearchArticlesParams = {}) {
  try {
    // Resolve table names
    const [articlesTable, categoriesTable, subcategoriesTable, authorsTable, articleTagsTable, tagsTable, likesTable, commentsTable] = await Promise.all([
      resolveTableName("Articles"),
      resolveTableName("Categories"),
      resolveTableName("SubCategories"),
      resolveTableName("Authors"),
      resolveTableName("Article_Tags"),
      resolveTableName("Tags"),
      resolveTableName("Likes"),
      resolveTableName("Comments"),
    ]);

    if (!articlesTable || !categoriesTable || !subcategoriesTable || !authorsTable || !articleTagsTable || !tagsTable || !likesTable || !commentsTable) {
      return { data: [], totalCount: 0, error: "Failed to resolve table names." };
    }

    const limitValue = Math.max(1, Number(limit) || 20);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;

    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];

    if (search.trim()) {
      conditions.push("(a.title LIKE ? OR a.content LIKE ?)");
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    if (categoryIds.length > 0) {
      const placeholders = categoryIds.map(() => "?").join(",");
      conditions.push(`a.category_id IN (${placeholders})`);
      params.push(...categoryIds.map(id => Number(id)));
    }

    if (subcategoryIds.length > 0) {
      const placeholders = subcategoryIds.map(() => "?").join(",");
      conditions.push(`a.sub_category_id IN (${placeholders})`);
      params.push(...subcategoryIds.map(id => Number(id)));
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = `SELECT COUNT(DISTINCT a.id) as total FROM \`${articlesTable}\` a ${whereClause}`;
    const countResult = await query<{ total: number }>(countQuery, params);

    const totalCount = countResult.data && Array.isArray(countResult.data) && countResult.data[0]?.total
      ? Number(countResult.data[0].total)
      : 0;

    // Get articles
    const result = await query(
      `SELECT
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(DISTINCT t.name) as tag_names,
        GROUP_CONCAT(DISTINCT t.color) as tag_colors,
        (SELECT COUNT(*) FROM \`${likesTable}\` WHERE article_id = a.id) as likes_count,
        (SELECT COUNT(*) FROM \`${commentsTable}\` WHERE article_id = a.id) as comments_count
      FROM \`${articlesTable}\` a
      LEFT JOIN \`${categoriesTable}\` c ON a.category_id = c.id
      LEFT JOIN \`${subcategoriesTable}\` sc ON a.sub_category_id = sc.id
      LEFT JOIN \`${authorsTable}\` au ON a.author_id = au.id
      LEFT JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
      LEFT JOIN \`${tagsTable}\` t ON at.tag_id = t.id
      ${whereClause}
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}`,
      params
    );

    if (result.error || !result.data) {
      return { data: [], totalCount: 0, error: result.error ?? "Failed to search articles." };
    }

    const rawArticles = Array.isArray(result.data) ? (result.data as any[]) : [];
    const articles = rawArticles.map((article) => ({
      id: Number(article.id),
      title: String(article.title ?? ""),
      content: String(article.content ?? ""),
      image: typeof article.image === "string" ? article.image : null,
      category_id: Number(article.category_id),
      sub_category_id: article.sub_category_id ? Number(article.sub_category_id) : null,
      author_id: Number(article.author_id),
      user_id: Number(article.user_id),
      published_at: new Date(article.published_at),
      created_at: new Date(article.created_at),
      updated_at: new Date(article.updated_at),
      category_name: typeof article.category_name === "string" ? article.category_name : "",
      subcategory_name: typeof article.subcategory_name === "string" ? article.subcategory_name : null,
      author_name: typeof article.author_name === "string" ? article.author_name : "",
      tag_names: article.tag_names ? article.tag_names.split(",").filter(Boolean) : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",").filter(Boolean) : [],
      likes_count: Number(article.likes_count ?? 0),
      comments_count: Number(article.comments_count ?? 0),
    }));

    return { data: articles, totalCount, error: null };
  } catch (error) {
    return { data: [], totalCount: 0, error: error instanceof Error ? error.message : "Failed to search articles." };
  }
}

