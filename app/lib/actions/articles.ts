"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { RowDataPacket } from "mysql2";
import { Article } from "../definition";
import mysql from "mysql2/promise";
import pool from "../db/db";

export interface ArticleWithJoins extends Article, RowDataPacket {
  category_name?: string;
  sub_category_name?: string;
  author_name?: string;
  user_firstname?: string;
  user_lastname?: string;
}

export async function getArticles(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  subcategoryId?: string;
  tag?: string;
  type?: "trending";
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const offset = (page - 1) * limit;
  const search = params?.search || "";
  const sortField = params?.sortField || "published_at";
  const sortDirection = params?.sortDirection || "desc";

  let sqlQuery = `
    SELECT 
      a.id,
      a.title,
      a.content,
      a.category_id,
      a.user_id,
      a.author_id,
      a.sub_category_id,
      a.image,
      a.video,
      a.published_at,
      a.is_featured,
      a.headline_priority,
      a.headline_image_url,
      a.headline_video_url,
      a.is_trending,
      a.updated_at,
      c.name as category_name,
      sc.name as sub_category_name,
      CONCAT(u.firstname, ' ', u.lastname) as author_name,
      GROUP_CONCAT(t.name) as tag_names,
      GROUP_CONCAT(t.id) as tag_ids
    FROM Articles a
    LEFT JOIN Categories c ON a.category_id = c.id
    LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
    LEFT JOIN Users u ON a.user_id = u.id
    LEFT JOIN Article_Tags at ON a.id = at.article_id
    LEFT JOIN Tags t ON at.tag_id = t.id
  `;

  const conditions = [];
  const values = [];

  if (search) {
    conditions.push("(a.title LIKE ? OR a.content LIKE ?)");
    values.push(`%${search}%`, `%${search}%`);
  }

  if (params?.subcategoryId) {
    conditions.push("a.sub_category_id = ?");
    values.push(params.subcategoryId);
  }

  if (params?.tag) {
    conditions.push("t.name = ?");
    values.push(params.tag);
  }

  if (params?.type === "trending") {
    conditions.push("a.is_trending = true");
  }

  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }

  // Get total count for pagination
  const countQuery = `
    SELECT COUNT(DISTINCT a.id) as total
    FROM Articles a
    LEFT JOIN Categories c ON a.category_id = c.id
    LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
    LEFT JOIN Users u ON a.user_id = u.id
    LEFT JOIN Article_Tags at ON a.id = at.article_id
    LEFT JOIN Tags t ON at.tag_id = t.id
    ${conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""}
  `;
  const { data: countData } = await query(countQuery, values);
  const totalItems = countData?.[0]?.total || 0;

  // Add sorting and pagination
  sqlQuery += `
    GROUP BY a.id, c.name, sc.name, u.firstname, u.lastname
    ORDER BY a.${sortField} ${sortDirection}
    LIMIT ? OFFSET ?
  `;

  values.push(limit, offset);

  try {
    const { data, error } = await query(sqlQuery, values);

    if (error) {
      console.error("Error in getArticles:", error);
      return { data: [], error, totalItems: 0, totalPages: 0 };
    }

    // Ensure data is an array
    const articlesData = Array.isArray(data) ? data : [];

    // Transform the data to ensure all required fields are present
    const articles = articlesData.map((article: any) => ({
      ...article,
      published_at: new Date(article.published_at),
      updated_at: new Date(article.updated_at),
      is_featured: Boolean(article.is_featured),
      is_trending: Boolean(article.is_trending),
      headline_priority: Number(article.headline_priority),
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_ids: article.tag_ids ? article.tag_ids.split(",").map(Number) : [],
    }));

    // Ensure totalItems and totalPages are at least 1 when there's data
    const finalTotalItems = articles.length > 0 ? totalItems : 0;
    const finalTotalPages =
      articles.length > 0 ? Math.max(1, Math.ceil(finalTotalItems / limit)) : 0;

    return {
      data: articles,
      error: null,
      totalItems: finalTotalItems,
      totalPages: finalTotalPages,
    };
  } catch (error) {
    console.error("Error in getArticles:", error);
    return {
      data: [],
      error: "Failed to fetch articles",
      totalItems: 0,
      totalPages: 0,
    };
  }
}

export async function getArticleById(id: number) {
  const { data, error } = await query(
    `
    SELECT 
      a.*,
      c.name as category_name,
      CONCAT(u.firstname, ' ', u.lastname) as author_name,
      GROUP_CONCAT(t.name) as tag_names,
      GROUP_CONCAT(t.id) as tag_ids
    FROM Articles a
    LEFT JOIN Categories c ON a.category_id = c.id
    LEFT JOIN Users u ON a.user_id = u.id
    LEFT JOIN Article_Tags at ON a.id = at.article_id
    LEFT JOIN Tags t ON at.tag_id = t.id
    WHERE a.id = ?
    GROUP BY a.id, c.name, u.firstname, u.lastname
  `,
    [id]
  );

  if (error) return { data: null, error };

  // Transform the data to ensure all required fields are present and properly formatted
  const article = data?.[0];
  if (article) {
    return {
      data: {
        ...article,
        published_at: new Date(article.published_at),
        updated_at: new Date(article.updated_at),
        is_featured: Boolean(article.is_featured),
        is_trending: Boolean(article.is_trending),
        headline_priority: Number(article.headline_priority),
        tag_names: article.tag_names ? article.tag_names.split(",") : [],
        tag_ids: article.tag_ids ? article.tag_ids.split(",").map(Number) : [],
      },
      error: null,
    };
  }

  return { data: null, error: null };
}

type CreateArticleData = Omit<Article, "id" | "published_at" | "updated_at"> & {
  tag_ids?: number[];
};

export async function createArticle(article: Article, tag_ids: number[]) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert article
    const [articleResult] = await connection.execute(
      `INSERT INTO Articles (
        title, content, category_id, user_id, author_id, 
        sub_category_id, image, video, published_at, updated_at,
        is_featured, headline_priority, headline_image_url, 
        headline_video_url, is_trending
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?)`,
      [
        article.title,
        article.content,
        article.category_id,
        article.user_id,
        article.author_id,
        article.sub_category_id || null,
        article.image || null,
        article.video || null,
        article.is_featured || false,
        article.headline_priority || 0,
        article.headline_image_url || null,
        article.headline_video_url || null,
        article.is_trending || false,
      ]
    );

    const newArticleId = (articleResult as any).insertId;

    // Insert article tags
    if (tag_ids.length > 0) {
      const placeholders = tag_ids.map(() => "(?, ?)").join(",");
      const values = tag_ids.flatMap((tagId) => [newArticleId, tagId]);

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
        [newArticleId, article.image]
      );
    }

    // Insert video into Videos table if present
    if (article.video) {
      await connection.execute(
        `INSERT INTO Videos (article_id, video_url, created_at) 
         VALUES (?, ?, NOW())`,
        [newArticleId, article.video]
      );
    }

    await connection.commit();
    return newArticleId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateArticle(
  id: number,
  article: Partial<Article>,
  tag_ids?: number[]
) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

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
    if (article.image) {
      // Get the previous main image URL from Articles table
      const [previousImage] = await connection.execute(
        "SELECT image FROM Articles WHERE id = ?",
        [id]
      );
      const previousImageUrl = (previousImage as any[])[0]?.image;

      // Update the main article image in the Articles table
      await connection.execute("UPDATE Articles SET image = ? WHERE id = ?", [
        article.image,
        id,
      ]);

      // Always insert the new main image as a new record in the Images table
      await connection.execute(
        "INSERT INTO Images (article_id, image_url, created_at) VALUES (?, ?, NOW())",
        [id, article.image]
      );

      // If there was a previous main image, ensure it exists in the Images table
      if (previousImageUrl) {
        const [existingImage] = await connection.execute(
          "SELECT id FROM Images WHERE article_id = ? AND image_url = ?",
          [id, previousImageUrl]
        );

        // If the previous main image doesn't exist in the Images table, add it
        if ((existingImage as any[]).length === 0) {
          await connection.execute(
            "INSERT INTO Images (article_id, image_url, created_at) VALUES (?, ?, NOW())",
            [id, previousImageUrl]
          );
        }
      }
    }

    // Handle video update
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

    await connection.commit();

    // Get the updated article
    const [updatedArticle] = await connection.execute(
      "SELECT * FROM Articles WHERE id = ?",
      [id]
    );

    return (updatedArticle as any[])[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteArticle(id: number) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

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

    await connection.commit();
    return (result as any).affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
