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
  sortField = "created_at",
  sortDirection = "desc",
}: GetArticlesParams = {}) {
  try {
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
        (SELECT COUNT(*) FROM Articles) as total_count
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
      LEFT JOIN Authors au ON a.author_id = au.id
      LEFT JOIN Article_Tags at ON a.id = at.article_id
      LEFT JOIN Tags t ON at.tag_id = t.id
      GROUP BY a.id
      ORDER BY a.${sortField} ${sortDirection}
      LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );

    if (!result.data || result.data.length === 0) {
      return {
        data: [],
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
      };
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

    const start = offset + 1;
    const end = Math.min(offset + limit, totalCount);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: articles,
      totalCount,
      start,
      end,
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { error: "Failed to fetch articles" };
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
    if (article.image !== undefined) {
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
