"use server";

// Component Info
// Description: Server actions for fetching front-end articles with various filters and pagination.
// Date created: 2025-11-18
// Author: thangtruong

import { query } from "../db/query";
import { Article } from "../definition";
import { resolveTableName } from "../db/tableNameResolver";

type FrontendArticleRow = Article & {
  category_name?: string | null;
  subcategory_name?: string | null;
  author_name?: string | null;
  tag_names?: string | null;
  tag_colors?: string | null;
  likes_count?: number | null;
  comments_count?: number | null;
  views_count?: number | null;
  total_count?: number;
};

/**
 * Fetches articles with optional filtering by type and subcategory
 * Used for general article listing with basic filters
 */
export async function getFrontEndArticles({
  type,
  page = 1,
  itemsPerPage = 10,
  subcategoryId,
}: {
  type?: string;
  page?: number;
  itemsPerPage?: number;
  subcategoryId?: string;
} = {}) {
  try {
    // Resolve table names with proper casing
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

    // Validate table names are resolved
    if (!articlesTable || !categoriesTable || !subcategoriesTable || !authorsTable || !articleTagsTable || !tagsTable || !likesTable || !commentsTable) {
      return { data: [], totalCount: 0, error: "Failed to resolve table names." };
    }

    const limitValue = Math.max(1, Number(itemsPerPage) || 10);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;

    // Build the WHERE clause based on filters
    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    if (type === "trending") {
      whereClause += " AND a.is_trending = 1";
    }

    if (subcategoryId) {
      whereClause += " AND a.sub_category_id = ?";
      params.push(subcategoryId);
    }

    const result = await query<
      Article & {
        category_name?: string | null;
        subcategory_name?: string | null;
        author_name?: string | null;
        tag_names?: string | null;
        tag_colors?: string | null;
        likes_count?: number | null;
        comments_count?: number | null;
        total_count: number;
      }
    >(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.color) as tag_colors,
        (SELECT COUNT(*) FROM \`${likesTable}\` WHERE article_id = a.id) as likes_count,
        (SELECT COUNT(*) FROM \`${commentsTable}\` WHERE article_id = a.id) as comments_count,
        (SELECT COUNT(*) FROM \`${articlesTable}\` ${whereClause}) as total_count
      FROM \`${articlesTable}\` a
      LEFT JOIN \`${categoriesTable}\` c ON a.category_id = c.id
      LEFT JOIN \`${subcategoriesTable}\` sc ON a.sub_category_id = sc.id
      LEFT JOIN \`${authorsTable}\` au ON a.author_id = au.id
      LEFT JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
      LEFT JOIN \`${tagsTable}\` t ON at.tag_id = t.id
      ${whereClause}
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `,
      params
    );

    const rows = Array.isArray(result.data)
      ? (result.data as Array<
          Article & {
            category_name?: string | null;
            subcategory_name?: string | null;
            author_name?: string | null;
            tag_names?: string | null;
            tag_colors?: string | null;
            likes_count?: number | null;
            comments_count?: number | null;
            total_count: number;
          }
        >)
      : [];

    if (rows.length === 0) {
      return { data: [], totalCount: 0, error: null };
    }

    const totalCount = rows[0].total_count;
    const articles = rows.map((article) => ({
      ...article,
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
      likes_count: Number(article.likes_count ?? 0),
      comments_count: Number(article.comments_count ?? 0),
      views_count: 0,
    }));

    return { data: articles, totalCount, error: null };
  } catch (error) {
    return { data: [], totalCount: 0, error: "Failed to fetch articles" };
  }
}

/**
 * Fetches articles for the explore page with advanced filtering
 * Supports filtering by type, subcategory, and tags
 */
export async function getExploreArticles({
  type,
  page = 1,
  itemsPerPage = 10,
  subcategoryId,
  tag,
}: {
  type?: string;
  page?: number;
  itemsPerPage?: number;
  subcategoryId?: string;
  tag?: string;
} = {}) {
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

    const offset = (page - 1) * itemsPerPage;

    // Build the WHERE clause based on filters
    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    if (type === "trending") {
      whereClause += " AND a.is_trending = 1";
    }

    if (subcategoryId) {
      whereClause += " AND a.sub_category_id = ?";
      params.push(subcategoryId);
    }

    if (tag) {
      whereClause += " AND t.name = ?";
      params.push(tag);
    }

    const result = await query<
      Article & {
        category_name?: string | null;
        subcategory_name?: string | null;
        author_name?: string | null;
        tag_names?: string | null;
        tag_colors?: string | null;
        likes_count?: number | null;
        comments_count?: number | null;
        views_count?: number | null;
        total_count: number;
      }
    >(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.color) as tag_colors,
        (SELECT COUNT(*) FROM \`${articlesTable}\` a2
         LEFT JOIN \`${articleTagsTable}\` at2 ON a2.id = at2.article_id
         LEFT JOIN \`${tagsTable}\` t2 ON at2.tag_id = t2.id
         ${whereClause}) as total_count
      FROM \`${articlesTable}\` a
      LEFT JOIN \`${categoriesTable}\` c ON a.category_id = c.id
      LEFT JOIN \`${subcategoriesTable}\` sc ON a.sub_category_id = sc.id
      LEFT JOIN \`${authorsTable}\` au ON a.author_id = au.id
      LEFT JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
      LEFT JOIN \`${tagsTable}\` t ON at.tag_id = t.id
      ${whereClause}
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ? OFFSET ?
    `,
      [...params, itemsPerPage, offset]
    );

    const rows = Array.isArray(result.data) ? result.data : [];

    if (rows.length === 0) {
      return { data: [], totalCount: 0, error: null };
    }

    const totalCount = rows[0].total_count;
    const articles = rows.map((article) => ({
      ...article,
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
      likes_count: Number(article.likes_count ?? 0),
      comments_count: Number(article.comments_count ?? 0),
      views_count: 0,
    }));

    return { data: articles, totalCount, error: null };
  } catch (_error) {
    return { data: [], totalCount: 0, error: "Failed to fetch articles" };
  }
}

/**
 * Fetches articles for a specific subcategory
 * Used in subcategory-specific article listings
 */
export async function getSubcategoryArticles({
  subcategoryId,
  page = 1,
  itemsPerPage = 10,
}: {
  subcategoryId: string;
  page?: number;
  itemsPerPage?: number;
}) {
  try {
    // Resolve table names with proper casing
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

    // Validate table names are resolved
    if (!articlesTable || !categoriesTable || !subcategoriesTable || !authorsTable || !articleTagsTable || !tagsTable || !likesTable || !commentsTable) {
      return {
        data: [],
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
        error: "Failed to resolve table names.",
      };
    }

    const limitValue = Math.max(1, Number(itemsPerPage) || 10);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM \`${articlesTable}\` a
      WHERE a.sub_category_id = ?
    `;
    const countResult = await query(countQuery, [subcategoryId]);

    // Check for count query errors
    if (countResult.error || !countResult.data) {
      return {
        data: [],
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
        error: null,
      };
    }

    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as Array<{ total: number }>)
      : [];
    const totalCount = countRows.length > 0 ? countRows[0].total : 0;

    if (totalCount === 0) {
      return {
        data: [],
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
        error: null,
      };
    }

    // Get articles with pagination
    const articlesQuery = `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.color) as tag_colors,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT cm.id) as comments_count
      FROM \`${articlesTable}\` a
      LEFT JOIN \`${categoriesTable}\` c ON a.category_id = c.id
      LEFT JOIN \`${subcategoriesTable}\` sc ON a.sub_category_id = sc.id
      LEFT JOIN \`${authorsTable}\` au ON a.author_id = au.id
      LEFT JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
      LEFT JOIN \`${tagsTable}\` t ON at.tag_id = t.id
      LEFT JOIN \`${likesTable}\` l ON a.id = l.article_id
      LEFT JOIN \`${commentsTable}\` cm ON a.id = cm.article_id
      WHERE a.sub_category_id = ?
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `;

    const articlesResult = await query<FrontendArticleRow>(articlesQuery, [
      subcategoryId,
    ]);

    // Check for query errors
    if (articlesResult.error || !articlesResult.data) {
      return {
        data: [],
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
        error: null,
      };
    }

    const articleRows = Array.isArray(articlesResult.data)
      ? (articlesResult.data as FrontendArticleRow[])
      : [];

    const formattedArticles = articleRows.map((article) => ({
      ...article,
      tag_names: article.tag_names ? article.tag_names.split(",").filter(Boolean) : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",").filter(Boolean) : [],
      likes_count: Number(article.likes_count ?? 0),
      comments_count: Number(article.comments_count ?? 0),
      views_count: 0,
    }));

    return {
      data: formattedArticles,
      totalCount,
      start: offsetValue + 1,
      end: Math.min(offsetValue + limitValue, totalCount),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limitValue),
      error: null,
    };
  } catch (_error) {
    return {
      data: [],
      totalCount: 0,
      start: 0,
      end: 0,
      currentPage: page,
      totalPages: 0,
      error: null,
    };
  }
}

/**
 * Fetches articles for a specific category with pagination
 * Used in category-specific article listings with detailed metadata
 */
export async function getCategoryArticles({
  categoryId,
  page = 1,
  itemsPerPage = 10,
}: {
  categoryId: string;
  page?: number;
  itemsPerPage?: number;
}) {
  try {
    // Resolve table names with proper casing
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

    // Validate table names are resolved
    if (!articlesTable || !categoriesTable || !subcategoriesTable || !authorsTable || !articleTagsTable || !tagsTable || !likesTable || !commentsTable) {
      return {
        data: [],
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
        error: "Failed to resolve table names.",
      };
    }

    const limitValue = Math.max(1, Number(itemsPerPage) || 10);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM \`${articlesTable}\` a
      WHERE a.category_id = ?
    `;
    const countResult = await query(countQuery, [categoryId]);

    // Check for count query errors
    if (countResult.error || !countResult.data) {
      return {
        data: [],
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
        error: null,
      };
    }

    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as Array<{ total: number }>)
      : [];
    const totalCount = countRows.length > 0 ? countRows[0].total : 0;

    if (totalCount === 0) {
      return {
        data: [],
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
        error: null,
      };
    }

    // Get articles with pagination

    const articlesQuery = `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.color) as tag_colors,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT cm.id) as comments_count
      FROM \`${articlesTable}\` a
      LEFT JOIN \`${categoriesTable}\` c ON a.category_id = c.id
      LEFT JOIN \`${subcategoriesTable}\` sc ON a.sub_category_id = sc.id
      LEFT JOIN \`${authorsTable}\` au ON a.author_id = au.id
      LEFT JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
      LEFT JOIN \`${tagsTable}\` t ON at.tag_id = t.id
      LEFT JOIN \`${likesTable}\` l ON a.id = l.article_id
      LEFT JOIN \`${commentsTable}\` cm ON a.id = cm.article_id
      WHERE a.category_id = ?
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `;

    const articlesResult = await query<FrontendArticleRow>(articlesQuery, [
      categoryId,
    ]);

    // Check for query errors
    if (articlesResult.error || !articlesResult.data) {
      return {
        data: [],
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
        error: null,
      };
    }

    const articleRows = Array.isArray(articlesResult.data)
      ? (articlesResult.data as FrontendArticleRow[])
      : [];

    const formattedArticles = articleRows.map((article) => ({
      ...article,
      tag_names: article.tag_names ? article.tag_names.split(",").filter(Boolean) : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",").filter(Boolean) : [],
      likes_count: Number(article.likes_count ?? 0),
      comments_count: Number(article.comments_count ?? 0),
      views_count: 0,
    }));

    return {
      data: formattedArticles,
      totalCount,
      start: offsetValue + 1,
      end: Math.min(offsetValue + limitValue, totalCount),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limitValue),
      error: null,
    };
  } catch (_error) {
    return {
      data: [],
      totalCount: 0,
      start: 0,
      end: 0,
      currentPage: page,
      totalPages: 0,
      error: "Failed to fetch category articles",
    };
  }
}

/**
 * Fetches articles filtered by a specific tag with pagination
 * Used in tag-specific article listings
 */
export async function getArticlesByTag({
  tagId,
  page = 1,
  itemsPerPage = 10,
}: {
  tagId: string;
  page?: number;
  itemsPerPage?: number;
}): Promise<{
  data: Article[] | null;
  totalCount: number;
  error: string | null;
}> {
  try {
    // Resolve table names with proper casing
    const [articlesTable, categoriesTable, subcategoriesTable, authorsTable, articleTagsTable, tagsTable, likesTable, commentsTable, viewsTable] = await Promise.all([
      resolveTableName("Articles"),
      resolveTableName("Categories"),
      resolveTableName("SubCategories"),
      resolveTableName("Authors"),
      resolveTableName("Article_Tags"),
      resolveTableName("Tags"),
      resolveTableName("Likes"),
      resolveTableName("Comments"),
      resolveTableName("Views"),
    ]);

    // Validate table names are resolved
    if (!articlesTable || !categoriesTable || !subcategoriesTable || !authorsTable || !articleTagsTable || !tagsTable || !likesTable || !commentsTable || !viewsTable) {
      return {
        data: [],
        totalCount: 0,
        error: "Failed to resolve table names.",
      };
    }

    const limitValue = Math.max(1, Number(itemsPerPage) || 10);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;
    
    // Get total count of articles with this tag
    const countQuery = `
      SELECT COUNT(DISTINCT a.id) as total
      FROM \`${articlesTable}\` a
      INNER JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
      WHERE at.tag_id = ?
    `;
    const countResult = await query(countQuery, [tagId]);

    // Check for count query errors
    if (countResult.error || !countResult.data) {
      return {
        data: [],
        totalCount: 0,
        error: null,
      };
    }

    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as Array<{ total: number }>)
      : [];
    const totalCount = countRows.length > 0 ? countRows[0].total : 0;

    if (totalCount === 0) {
      return {
        data: [],
        totalCount: 0,
        error: null,
      };
    }

    // Get articles with their related data
    const articlesQuery = `
      WITH FilteredArticles AS (
        SELECT DISTINCT a.id
        FROM \`${articlesTable}\` a
        INNER JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
        WHERE at.tag_id = ?
      )
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(DISTINCT t.name ORDER BY t.id) as tag_names,
        GROUP_CONCAT(DISTINCT t.color ORDER BY t.id) as tag_colors,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT cm.id) as comments_count,
        COUNT(DISTINCT v.id) as views_count
      FROM FilteredArticles fa
      INNER JOIN \`${articlesTable}\` a ON fa.id = a.id
      LEFT JOIN \`${categoriesTable}\` c ON a.category_id = c.id
      LEFT JOIN \`${subcategoriesTable}\` sc ON a.sub_category_id = sc.id
      LEFT JOIN \`${authorsTable}\` au ON a.author_id = au.id
      LEFT JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
      LEFT JOIN \`${tagsTable}\` t ON at.tag_id = t.id
      LEFT JOIN \`${likesTable}\` l ON a.id = l.article_id
      LEFT JOIN \`${commentsTable}\` cm ON a.id = cm.article_id
      LEFT JOIN \`${viewsTable}\` v ON a.id = v.article_id
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `;

    const articlesResult = await query<FrontendArticleRow>(articlesQuery, [
      tagId,
    ]);

    // Check for query errors
    if (articlesResult.error || !articlesResult.data) {
      return {
        data: [],
        totalCount: 0,
        error: null,
      };
    }

    const articleRows = Array.isArray(articlesResult.data)
      ? (articlesResult.data as FrontendArticleRow[])
      : [];

    if (articleRows.length === 0) {
      return {
        data: [],
        totalCount: totalCount,
        error: null,
      };
    }

    // Map articles with proper tag formatting
    const articles = articleRows.map((article) => {
      // Ensure tag names and colors are arrays and have the same length
      const tagNames = article.tag_names ? article.tag_names.split(",").filter(Boolean) : [];
      const tagColors = article.tag_colors ? article.tag_colors.split(",").filter(Boolean) : [];

      // If we have more tag names than colors, duplicate the last color
      const adjustedTagColors = tagNames.map((_: string, index: number) =>
        tagColors[index] || tagColors[tagColors.length - 1] || "#6B7280"
      );

      return {
        ...article,
        tag_names: tagNames,
        tag_colors: adjustedTagColors,
        likes_count: Number(article.likes_count ?? 0),
        comments_count: Number(article.comments_count ?? 0),
        views_count: Number(article.views_count ?? 0),
      };
    });

    return {
      data: articles,
      totalCount: totalCount,
      error: null,
    };
  } catch (_error) {
    return {
      data: [],
      totalCount: 0,
      error: null,
    };
  }
}