"use server";

// Component Info
// Description: Server action fetching highlight articles with pagination and metadata.
// Date updated: 2025-November-21
// Author: thangtruong

import { query } from "../db/query";
import { resolveTableName } from "../db/tableNameResolver";

type HighlightArticleRow = {
  total_count: number;
  tag_names?: string | null;
  tag_ids?: string | null;
  tag_colors?: string | null;
  likes_count?: number | null;
  comments_count?: number | null;
  is_featured?: number | boolean | null;
  is_trending?: number | boolean | null;
  headline_priority?: number | null;
  published_at: string | Date;
  updated_at: string | Date;
} & Record<string, unknown>;

export async function getHighlightArticles({
  page = 1,
  itemsPerPage = 6,
}: {
  page?: number;
  itemsPerPage?: number;
} = {}) {
  try {
    // Resolve table names with proper casing - with fallback to preferred names
    let articlesTable: string;
    let categoriesTable: string;
    let subcategoriesTable: string;
    let authorsTable: string;
    let articleTagsTable: string;
    let tagsTable: string;
    let likesTable: string;
    let commentsTable: string;

    try {
      const resolvedTables = await Promise.all([
        resolveTableName("Articles"),
        resolveTableName("Categories"),
        resolveTableName("SubCategories"),
        resolveTableName("Authors"),
        resolveTableName("Article_Tags"),
        resolveTableName("Tags"),
        resolveTableName("Likes"),
        resolveTableName("Comments"),
      ]);
      articlesTable = resolvedTables[0] || "Articles";
      categoriesTable = resolvedTables[1] || "Categories";
      subcategoriesTable = resolvedTables[2] || "SubCategories";
      authorsTable = resolvedTables[3] || "Authors";
      articleTagsTable = resolvedTables[4] || "Article_Tags";
      tagsTable = resolvedTables[5] || "Tags";
      likesTable = resolvedTables[6] || "Likes";
      commentsTable = resolvedTables[7] || "Comments";
    } catch (_resolveError) {
      // Fallback to preferred names if resolution fails
      articlesTable = "Articles";
      categoriesTable = "Categories";
      subcategoriesTable = "SubCategories";
      authorsTable = "Authors";
      articleTagsTable = "Article_Tags";
      tagsTable = "Tags";
      likesTable = "Likes";
      commentsTable = "Comments";
    }

    const limitValue = Math.max(1, Number(itemsPerPage) || 6);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;

    const result = await query<HighlightArticleRow>(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.id) as tag_ids,
        GROUP_CONCAT(t.color) as tag_colors,
        (SELECT COUNT(*) FROM \`${likesTable}\` WHERE article_id = a.id) as likes_count,
        (SELECT COUNT(*) FROM \`${commentsTable}\` WHERE article_id = a.id) as comments_count,
        (SELECT COUNT(*) FROM \`${articlesTable}\` WHERE headline_priority != 0) as total_count
      FROM \`${articlesTable}\` a
      LEFT JOIN \`${categoriesTable}\` c ON a.category_id = c.id
      LEFT JOIN \`${subcategoriesTable}\` sc ON a.sub_category_id = sc.id
      LEFT JOIN \`${authorsTable}\` au ON a.author_id = au.id
      LEFT JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
      LEFT JOIN \`${tagsTable}\` t ON at.tag_id = t.id
      WHERE a.headline_priority != 0
      GROUP BY a.id, c.name, sc.name, au.name
      ORDER BY a.headline_priority DESC, a.published_at DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `
    );

    const { data, error } = result;

    const rows = Array.isArray(data) ? (data as HighlightArticleRow[]) : [];

    // Check for empty data first (like FeaturedArticles)
    if (rows.length === 0) {
      return { data: [], error: null, totalCount: 0 };
    }

    // Only return error if there's an actual query error and we have rows
    if (error) {
      return { data: [], error, totalCount: 0 };
    }

    const normalizeDate = (value: unknown): string => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (typeof value === "string" || typeof value === "number") {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
          return parsed.toISOString();
        }
        return String(value);
      }
      return "";
    };

    const articles = rows.map((article) => ({
      ...article,
      published_at: normalizeDate(article.published_at),
      updated_at: normalizeDate(article.updated_at),
      is_featured: Boolean(article.is_featured),
      is_trending: Boolean(article.is_trending),
      headline_priority: Number(article.headline_priority ?? 0),
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_ids: article.tag_ids ? article.tag_ids.split(",").map(Number) : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
      likes_count: Number(article.likes_count ?? 0),
      comments_count: Number(article.comments_count ?? 0),
      views_count: Number((article as { views_count?: number }).views_count ?? 0),
    }));

    const totalCount = Number(rows[0].total_count ?? 0);
    return { data: articles, error: null, totalCount };
  } catch (_error) {
    return {
      data: [],
      error: "Failed to fetch highlight articles",
      totalCount: 0,
    };
  }
}
