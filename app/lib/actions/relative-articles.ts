"use server";

// Component Info
// Description: Server action fetching related articles based on category, subcategory, and tags.
// Date created: 2025-01-27
// Author: thangtruong

import { query } from "../db/db";
import { resolveTableName } from "../db/tableNameResolver";

type RelativeArticleRow = {
  category_id?: number | null;
  sub_category_id?: number | null;
  tag_ids?: string | null;
  tag_names?: string | null;
  tag_colors?: string | null;
  likes_count?: number | null;
  comments_count?: number | null;
  total_count?: number | null;
} & Record<string, unknown>;

export async function getRelativeArticles(
  currentArticleId?: number,
  page: number = 1,
  limit: number = 10
) {
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

    // Calculate offset for MySQL pagination
    const offset = (page - 1) * limit;

    // First get the current article's category and tags
    const currentArticleQuery = currentArticleId
      ? await query<RelativeArticleRow>(
          `
          SELECT 
            a.category_id,
            a.sub_category_id,
            GROUP_CONCAT(t.id) as tag_ids
          FROM \`${articlesTable}\` a
          LEFT JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
          LEFT JOIN \`${tagsTable}\` t ON at.tag_id = t.id
          WHERE a.id = ?
          GROUP BY a.id
        `,
          [currentArticleId]
        )
      : null;

    const currentArticle = currentArticleQuery?.data?.[0];
    const tagIds = currentArticle?.tag_ids
      ? currentArticle.tag_ids.split(",")
      : [];
    const categoryId = currentArticle?.category_id;
    const subCategoryId = currentArticle?.sub_category_id;

    // If no current article ID is provided, get all articles
    const whereClause = currentArticleId
      ? `WHERE a.id != ? AND (
          a.category_id = ? 
          OR a.sub_category_id = ?
          OR at.tag_id IN (${tagIds.length > 0 ? tagIds.join(",") : "0"})
        ) AND a.is_featured = FALSE 
          AND a.headline_priority = 0 
          AND a.is_trending = FALSE`
      : `WHERE a.is_featured = FALSE 
          AND a.headline_priority = 0 
          AND a.is_trending = FALSE`;

    // Build the query to find related articles
    const result = await query(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(DISTINCT t.name ORDER BY t.id) as tag_names,
        GROUP_CONCAT(DISTINCT t.color ORDER BY t.id) as tag_colors,
        (SELECT COUNT(*) FROM \`${likesTable}\` WHERE article_id = a.id) as likes_count,
        (SELECT COUNT(*) FROM \`${commentsTable}\` WHERE article_id = a.id) as comments_count,
        (
          SELECT COUNT(DISTINCT a2.id) 
          FROM \`${articlesTable}\` a2
          LEFT JOIN \`${articleTagsTable}\` at2 ON a2.id = at2.article_id
          ${currentArticleId ? `WHERE a2.id != ?` : ""}
          AND a2.is_featured = FALSE 
          AND a2.headline_priority = 0 
          AND a2.is_trending = FALSE
        ) as total_count
      FROM \`${articlesTable}\` a
      LEFT JOIN \`${categoriesTable}\` c ON a.category_id = c.id
      LEFT JOIN \`${subcategoriesTable}\` sc ON a.sub_category_id = sc.id
      LEFT JOIN \`${authorsTable}\` au ON a.author_id = au.id
      LEFT JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
      LEFT JOIN \`${tagsTable}\` t ON at.tag_id = t.id
      ${whereClause}
      GROUP BY a.id
      ORDER BY 
        CASE 
          WHEN a.category_id = ? AND a.sub_category_id = ? THEN 1
          WHEN a.category_id = ? THEN 2
          WHEN a.sub_category_id = ? THEN 3
          ELSE 4
        END,
        a.published_at DESC
      LIMIT ? OFFSET ?
    `,
      currentArticleId
        ? [
            currentArticleId,
            categoryId || 0,
            subCategoryId || 0,
            currentArticleId,
            categoryId || 0,
            subCategoryId || 0,
            categoryId || 0,
            subCategoryId || 0,
            limit,
            offset,
          ]
        : [
            categoryId || 0,
            subCategoryId || 0,
            categoryId || 0,
            subCategoryId || 0,
            limit,
            offset,
          ]
    );

    const rows = Array.isArray(result.data)
      ? (result.data as RelativeArticleRow[])
      : [];

    if (rows.length === 0) {
      return { data: [], totalCount: 0, error: null };
    }

    const totalCount = Number(rows[0].total_count ?? 0);
    const articles = rows.map((article) => {
      const tagNames = article.tag_names
        ? article.tag_names.split(",").filter(Boolean)
        : [];
      const tagColors = article.tag_colors
        ? article.tag_colors.split(",").filter(Boolean)
        : [];

      const adjustedTagColors = tagNames.map((_: string, index: number) =>
        tagColors[index] || tagColors[tagColors.length - 1] || "#6B7280"
      );

      return {
        ...article,
        tag_names: tagNames,
        tag_colors: adjustedTagColors,
        likes_count: Number(article.likes_count ?? 0),
        comments_count: Number(article.comments_count ?? 0),
        views_count: 0,
      };
    });

    return { data: articles, totalCount, error: null };
  } catch (_error) {
    return { data: [], totalCount: 0, error: "Failed to fetch relative articles" };
  }
}
