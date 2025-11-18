"use server";

import { query } from "../db/db";
import { RowDataPacket } from "mysql2";
import { Article } from "../definition";
import { transaction } from "../db/db";
import { resolveTableName } from "../db/tableNameResolver";

// Component Info
// Description: Server actions for article CRUD operations and queries.
// Date created: 2024-12-19
// Author: thangtruong

export interface ArticleWithJoins extends Article, RowDataPacket {
  category_name?: string;
  sub_category_name?: string;
  author_name?: string;
  user_firstname?: string;
  user_lastname?: string;
}

interface GetArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

export async function getArticles({
  page = 1,
  limit = 10,
  search,
  sortField = "published_at",
  sortDirection = "desc",
}: GetArticlesParams = {}) {
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

    const safePage = Number.isFinite(page) && page > 0 ? Number(page) : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Number(limit) : 10;
    const offset = (safePage - 1) * safeLimit;
    const allowedSortFields = new Set<keyof Article | string>([
      "published_at",
      "created_at",
      "updated_at",
      "title",
      "views_count",
    ]);
    const safeSortField = allowedSortFields.has(sortField)
      ? sortField
      : "published_at";
    const safeDirection = sortDirection === "asc" ? "ASC" : "DESC";

    // Build the WHERE clause based on search parameter
    const whereClause = search
      ? `WHERE a.title LIKE ? OR a.content LIKE ?`
      : "";

    // Build the query parameters
    const queryParams = search
      ? [`%${search}%`, `%${search}%`]
      : [];

    // First, get the total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM \`${articlesTable}\` a
      ${whereClause}
    `;
    
    const countResult = await query(countQuery, search ? [`%${search}%`, `%${search}%`] : []);
    
    if (countResult.error) {
      throw new Error(countResult.error);
    }

    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as Array<{ total: number }>)
      : [];
    const totalCount = countRows.length > 0 && typeof countRows[0]?.total === "number" ? countRows[0].total : 0;

    // Then get the articles with pagination
    const result = await query(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.color) as tag_colors
      FROM \`${articlesTable}\` a
      LEFT JOIN \`${categoriesTable}\` c ON a.category_id = c.id
      LEFT JOIN \`${subcategoriesTable}\` sc ON a.sub_category_id = sc.id
      LEFT JOIN \`${authorsTable}\` au ON a.author_id = au.id
      LEFT JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
      LEFT JOIN \`${tagsTable}\` t ON at.tag_id = t.id
      ${whereClause}
      GROUP BY a.id
      ORDER BY a.${safeSortField} ${safeDirection}
      LIMIT ${safeLimit} OFFSET ${offset}
    `,
      queryParams
    );

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.data || result.data.length === 0) {
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

    const rawArticles = Array.isArray(result.data)
      ? (result.data as Array<
          ArticleWithJoins & {
            tag_names?: string | null;
            tag_colors?: string | null;
            likes_count?: number | null;
            comments_count?: number | null;
          }
        >)
      : [];

    const articles = rawArticles.map((article) => ({
      ...article,
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
      likes_count: Number(article.likes_count ?? 0),
      comments_count: Number(article.comments_count ?? 0),
      views_count: Number((article as { views_count?: number }).views_count ?? 0),
    }));

    const start = offset + 1;
    const end = Math.min(offset + safeLimit, totalCount);
    const totalPages =
      totalCount > 0 ? Math.ceil(totalCount / safeLimit) : 1;

    return {
      data: articles,
      totalCount,
      start,
      end,
      currentPage: safePage,
      totalPages,
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
      error: "Failed to fetch articles.",
    };
  }
}

export async function getArticleById(id: number) {
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
      return { data: null, error: "Failed to resolve table names." };
    }

    const { data, error } = await query(
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
        (SELECT COUNT(*) FROM \`${commentsTable}\` WHERE article_id = a.id) as comments_count
      FROM \`${articlesTable}\` a
      LEFT JOIN \`${categoriesTable}\` c ON a.category_id = c.id
      LEFT JOIN \`${subcategoriesTable}\` sc ON a.sub_category_id = sc.id
      LEFT JOIN \`${authorsTable}\` au ON a.author_id = au.id
      LEFT JOIN \`${articleTagsTable}\` at ON a.id = at.article_id
      LEFT JOIN \`${tagsTable}\` t ON at.tag_id = t.id
      WHERE a.id = ?
      GROUP BY a.id, c.name, sc.name, au.name
    `,
      [id]
    );

    if (error) return { data: null, error };

    // Transform the data to ensure all required fields are present and properly formatted
    const rows = Array.isArray(data)
      ? (data as Array<
          ArticleWithJoins & {
            tag_names?: string | null;
            tag_ids?: string | null;
            tag_colors?: string | null;
            likes_count?: number | null;
            comments_count?: number | null;
            views_count?: number | null;
          }
        >)
      : [];

    const article = rows[0];
    if (article) {
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

      return {
        data: {
          ...article,
          published_at: normalizeDate(article.published_at),
          updated_at: normalizeDate(article.updated_at),
          is_featured: Boolean(article.is_featured),
          is_trending: Boolean(article.is_trending),
          headline_priority: Number(article.headline_priority),
          tag_names: article.tag_names ? article.tag_names.split(",") : [],
          tag_ids: article.tag_ids ? article.tag_ids.split(",").map(Number) : [],
          tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
          likes_count: Number(article.likes_count ?? 0),
          comments_count: Number(article.comments_count ?? 0),
          views_count: Number(article.views_count ?? 0),
        },
        error: null,
      };
    }

    return { data: null, error: "Article not found" };
  } catch (_error) {
    return { data: null, error: "Failed to fetch article" };
  }
}

export async function createArticle(article: Article, tag_ids: number[]) {
  return transaction(async (connection) => {
    // Insert article
    const [articleResult] = await connection.execute(
      `INSERT INTO Articles (
        title, content, category_id, user_id, author_id, 
        sub_category_id, image, video, published_at, updated_at,
        is_featured, headline_priority, is_trending
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)`,
      [
        String(article.title),
        String(article.content),
        Number(article.category_id),
        Number(article.user_id),
        Number(article.author_id),
        article.sub_category_id ? Number(article.sub_category_id) : null,
        article.image ? String(article.image) : null,
        article.video ? String(article.video) : null,
        Boolean(article.is_featured),
        Number(article.headline_priority),
        Boolean(article.is_trending),
      ]
    );

    const newArticleId = (articleResult as any).insertId;

    // Insert article tags
    if (tag_ids && tag_ids.length > 0) {
      const placeholders = tag_ids.map(() => "(?, ?)").join(",");
      const values = tag_ids.flatMap((tagId) => [
        Number(newArticleId),
        Number(tagId),
      ]);

      await connection.execute(
        `INSERT INTO Article_Tags (article_id, tag_id) VALUES ${placeholders}`,
        values
      );
    }

    // Insert image into Images table if present
    if (article.image) {
      await connection.execute(
        `INSERT INTO Images (article_id, image_url, created_at) 
         VALUES (?, ?, NOW())`,
        [Number(newArticleId), String(article.image)]
      );
    }

    // Insert video into Videos table if present
    if (article.video) {
      await connection.execute(
        `INSERT INTO Videos (article_id, video_url, created_at) 
         VALUES (?, ?, NOW())`,
        [Number(newArticleId), String(article.video)]
      );
    }

    return newArticleId;
  });
}

export async function updateArticle(
  id: number,
  article: Partial<Article>,
  tag_ids?: number[]
) {
  return transaction(async (connection) => {
    // Filter out non-database fields and undefined values
    const validFields = [
      "title",
      "content",
      "category_id",
      "author_id",
      "user_id",
      "sub_category_id",
      "image",
      "video",
      "is_featured",
      "headline_priority",
      "headline_image_url",
      "headline_video_url",
      "is_trending",
    ];

    const articleData = Object.fromEntries(
      Object.entries(article).filter(
        ([key, value]) => validFields.includes(key) && value !== undefined
      )
    );

    // Update article
    const setClauses = Object.keys(articleData)
      .map((key) => `${key} = ?`)
      .join(", ");

    await connection.execute(
      `UPDATE Articles SET ${setClauses}, updated_at = NOW() WHERE id = ?`,
      [...Object.values(articleData), id]
    );

    // Handle image update
    if (article.image !== undefined) {
      if (article.image) {
        // Update the main article image in the Articles table
        await connection.execute("UPDATE Articles SET image = ? WHERE id = ?", [
          article.image,
          id,
        ]);

        // Check if there's an existing image record
        const [existingImage] = await connection.execute(
          "SELECT id FROM Images WHERE article_id = ?",
          [id]
        );

        if ((existingImage as any[]).length > 0) {
          // Update existing image record
          await connection.execute(
            "UPDATE Images SET image_url = ?, updated_at = NOW() WHERE article_id = ?",
            [article.image, id]
          );
        } else {
          // Insert new image record if none exists
          await connection.execute(
            "INSERT INTO Images (article_id, image_url, created_at) VALUES (?, ?, NOW())",
            [id, article.image]
          );
        }
      } else {
        // If image is undefined, null, or empty string, delete the image from both tables
        // First get the current image URL
        const [currentImage] = await connection.execute(
          "SELECT image FROM Articles WHERE id = ?",
          [id]
        );
        const currentImageUrl = (currentImage as any[])[0]?.image;

        // Set the image field to NULL in Articles table
        await connection.execute(
          "UPDATE Articles SET image = NULL WHERE id = ?",
          [id]
        );

        // Only delete the specific image record that matches the current image URL
        if (currentImageUrl) {
          await connection.execute(
            "DELETE FROM Images WHERE article_id = ? AND image_url = ?",
            [id, currentImageUrl]
          );
        }
      }
    }

    // Handle video update
    if (article.video !== undefined) {
      if (article.video) {
        const [existingVideo] = await connection.execute(
          "SELECT id FROM Videos WHERE article_id = ?",
          [id]
        );

        if ((existingVideo as any[]).length > 0) {
          await connection.execute(
            "UPDATE Videos SET video_url = ?, updated_at = NOW() WHERE article_id = ?",
            [article.video, id]
          );
        } else {
          await connection.execute(
            "INSERT INTO Videos (article_id, video_url, created_at) VALUES (?, ?, NOW())",
            [id, article.video]
          );
        }
      } else {
        // If video is undefined, null, or empty string, delete the video from both tables
        // First get the current video URL
        const [currentVideo] = await connection.execute(
          "SELECT video FROM Articles WHERE id = ?",
          [id]
        );
        const currentVideoUrl = (currentVideo as any[])[0]?.video;

        // Set the video field to NULL in Articles table
        await connection.execute(
          "UPDATE Articles SET video = NULL WHERE id = ?",
          [id]
        );

        // Only delete the specific video record that matches the current video URL
        if (currentVideoUrl) {
          await connection.execute(
            "DELETE FROM Videos WHERE article_id = ? AND video_url = ?",
            [id, currentVideoUrl]
          );
        }
      }
    }

    // Update tags if provided
    if (tag_ids !== undefined) {
      await connection.execute(
        "DELETE FROM Article_Tags WHERE article_id = ?",
        [id]
      );

      if (tag_ids.length > 0) {
        const placeholders = tag_ids.map(() => "(?, ?)").join(",");
        const values = tag_ids.flatMap((tagId) => [id, tagId]);

        await connection.execute(
          `INSERT INTO Article_Tags (article_id, tag_id) VALUES ${placeholders}`,
          values
        );
      }
    }

    // Get the updated article
    const [updatedArticle] = await connection.execute(
      "SELECT * FROM Articles WHERE id = ?",
      [id]
    );

    return (updatedArticle as any[])[0];
  });
}

export async function deleteArticle(id: number) {
  return transaction(async (connection) => {
    // Delete article tags first
    await connection.execute("DELETE FROM Article_Tags WHERE article_id = ?", [
      id,
    ]);

    // Delete associated images
    await connection.execute("DELETE FROM Images WHERE article_id = ?", [id]);

    // Delete associated videos
    await connection.execute("DELETE FROM Videos WHERE article_id = ?", [id]);

    // Delete article
    const [result] = await connection.execute(
      "DELETE FROM Articles WHERE id = ?",
      [id]
    );

    return (result as any).affectedRows > 0;
  });
}
