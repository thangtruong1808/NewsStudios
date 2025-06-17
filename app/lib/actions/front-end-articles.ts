"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { RowDataPacket } from "mysql2";
import { Article } from "../definition";

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
        (SELECT COUNT(*) FROM Articles ${whereClause}) as total_count
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
      LEFT JOIN Authors au ON a.author_id = au.id
      LEFT JOIN Article_Tags at ON a.id = at.article_id
      LEFT JOIN Tags t ON at.tag_id = t.id
      ${whereClause}
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ? OFFSET ?
    `,
      [...params, itemsPerPage, offset]
    );

    if (!result.data || result.data.length === 0) {
      return { data: [], totalCount: 0 };
    }

    const totalCount = result.data[0].total_count;
    const articles = result.data.map((article) => ({
      ...article,
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
      likes_count: Number(article.likes_count) || 0,
      comments_count: Number(article.comments_count) || 0,
      views_count: 0, // Set default value since Views table doesn't exist
    }));

    return { data: articles, totalCount };
  } catch (error) {
    return { error: "Failed to fetch articles" };
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

    const result = await query(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.color) as tag_colors,
        (SELECT COUNT(*) FROM Articles a2
         LEFT JOIN Article_Tags at2 ON a2.id = at2.article_id
         LEFT JOIN Tags t2 ON at2.tag_id = t2.id
         ${whereClause}) as total_count
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
      LEFT JOIN Authors au ON a.author_id = au.id
      LEFT JOIN Article_Tags at ON a.id = at.article_id
      LEFT JOIN Tags t ON at.tag_id = t.id
      ${whereClause}
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ? OFFSET ?
    `,
      [...params, itemsPerPage, offset]
    );

    if (!result.data || result.data.length === 0) {
      return { data: [], totalCount: 0 };
    }

    const totalCount = result.data[0].total_count;
    const articles = result.data.map((article) => ({
      ...article,
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
      likes_count: Number(article.likes_count) || 0,
      comments_count: Number(article.comments_count) || 0,
      views_count: 0, // Set default value since Views table doesn't exist
    }));

    return { data: articles, totalCount };
  } catch (error) {
    return { error: "Failed to fetch articles" };
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
    const offset = (page - 1) * itemsPerPage;

    const result = await query(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.color) as tag_colors,
        (SELECT COUNT(*) FROM Articles WHERE sub_category_id = ?) as total_count
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
      LEFT JOIN Authors au ON a.author_id = au.id
      LEFT JOIN Article_Tags at ON a.id = at.article_id
      LEFT JOIN Tags t ON at.tag_id = t.id
      WHERE a.sub_category_id = ?
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ? OFFSET ?
    `,
      [subcategoryId, subcategoryId, itemsPerPage, offset]
    );

    if (!result.data || result.data.length === 0) {
      return { data: [], totalCount: 0 };
    }

    const totalCount = result.data[0].total_count;
    const articles = result.data.map((article) => ({
      ...article,
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
      likes_count: Number(article.likes_count) || 0,
      comments_count: Number(article.comments_count) || 0,
      views_count: 0,
    }));

    return { data: articles, totalCount };
  } catch (error) {
    return { error: "Failed to fetch articles" };
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
    const offset = (page - 1) * itemsPerPage;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Articles a
      WHERE a.category_id = ?
    `;
    const countResult = await query(countQuery, [categoryId]);
    if (!countResult.data || countResult.data.length === 0) {
      return { data: [], totalCount: 0 };
    }
    const totalCount = countResult.data[0].total;

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
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
      LEFT JOIN Authors au ON a.author_id = au.id
      LEFT JOIN Article_Tags at ON a.id = at.article_id
      LEFT JOIN Tags t ON at.tag_id = t.id
      LEFT JOIN Likes l ON a.id = l.article_id
      LEFT JOIN Comments cm ON a.id = cm.article_id
      WHERE a.category_id = ?
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ? OFFSET ?
    `;

    const articlesResult = await query(articlesQuery, [categoryId, itemsPerPage, offset]);
    if (!articlesResult.data) {
      return { data: [], totalCount: 0 };
    }
    const articles = articlesResult.data;

    // Format the response
    const formattedArticles = articles.map((article) => ({
      ...article,
      tag_names: article.tag_names
        ? article.tag_names.split(",").filter(Boolean)
        : [],
      tag_colors: article.tag_colors
        ? article.tag_colors.split(",").filter(Boolean)
        : [],
      likes_count: Number(article.likes_count) || 0,
      comments_count: Number(article.comments_count) || 0,
      views_count: 0, // Set default value since Views table doesn't exist
    }));

    return {
      data: formattedArticles,
      totalCount,
      start: offset + 1,
      end: Math.min(offset + itemsPerPage, totalCount),
      currentPage: page,
      totalPages: Math.ceil(totalCount / itemsPerPage),
    };
  } catch (error) {
    return { error: "Failed to fetch category articles" };
  }
}

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
    const offset = (page - 1) * itemsPerPage;
    
    // First get the total count of articles with this tag
    const countResult = await query(`
      SELECT COUNT(DISTINCT a.id) as total
      FROM Articles a
      INNER JOIN Article_Tags at ON a.id = at.article_id
      WHERE at.tag_id = ?
    `, [tagId]);

    if (!countResult.data || countResult.data.length === 0) {
      return {
        data: [],
        totalCount: 0,
        error: null
      };
    }

    // Then get the articles with their related data
    const result = await query(`
      WITH FilteredArticles AS (
        SELECT DISTINCT a.id
        FROM Articles a
        INNER JOIN Article_Tags at ON a.id = at.article_id
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
      INNER JOIN Articles a ON fa.id = a.id
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
      LEFT JOIN Authors au ON a.author_id = au.id
      LEFT JOIN Article_Tags at ON a.id = at.article_id
      LEFT JOIN Tags t ON at.tag_id = t.id
      LEFT JOIN Likes l ON a.id = l.article_id
      LEFT JOIN Comments cm ON a.id = cm.article_id
      LEFT JOIN Views v ON a.id = v.article_id
      GROUP BY a.id
      ORDER BY a.published_at DESC
      LIMIT ? OFFSET ?
    `, [tagId, itemsPerPage, offset]);

    if (!result.data || result.data.length === 0) {
      return {
        data: [],
        totalCount: 0,
        error: null
      };
    }

    const articles = result.data.map((article) => {
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
        likes_count: Number(article.likes_count) || 0,
        comments_count: Number(article.comments_count) || 0,
        views_count: Number(article.views_count) || 0
      };
    });

    return {
      data: articles,
      totalCount: countResult.data[0].total || 0,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      totalCount: 0,
      error: 'Failed to fetch articles'
    };
  }
}