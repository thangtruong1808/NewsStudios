"use server";

import { revalidatePath } from "next/cache";
import { query, transaction, TransactionClient } from "../db/query";
import { RowDataPacket } from "mysql2";
import { Article } from "../definition";

export interface ArticleWithJoins extends Article, RowDataPacket {
  category_name?: string;
  author_name?: string;
  user_firstname?: string;
  user_lastname?: string;
}

export async function getArticles() {
  const { data, error } = await query(`
    SELECT 
      a.*,
      c.name as category_name,
      CONCAT(u.firstname, ' ', u.lastname) as author_name,
      GROUP_CONCAT(t.name) as tag_names,
      GROUP_CONCAT(t.id) as tag_ids,
      COALESCE(a.published_at, NOW()) as published_at,
      COALESCE(a.is_featured, false) as is_featured,
      COALESCE(a.headline_priority, 0) as headline_priority,
      COALESCE(a.is_trending, false) as is_trending
    FROM Articles a
    LEFT JOIN Categories c ON a.category_id = c.id
    LEFT JOIN Users u ON a.user_id = u.id
    LEFT JOIN Article_Tags at ON a.id = at.article_id
    LEFT JOIN Tags t ON at.tag_id = t.id
    GROUP BY a.id, c.name, u.firstname, u.lastname
    ORDER BY a.published_at DESC
  `);

  if (error) throw new Error(error);

  // Transform the data to ensure all required fields are present
  return (data || []).map((article: any) => ({
    ...article,
    published_at: new Date(article.published_at),
    created_at: new Date(article.created_at),
    updated_at: new Date(article.updated_at),
    is_featured: Boolean(article.is_featured),
    is_trending: Boolean(article.is_trending),
    headline_priority: Number(article.headline_priority),
    tag_names: article.tag_names ? article.tag_names.split(",") : [],
    tag_ids: article.tag_ids ? article.tag_ids.split(",").map(Number) : [],
  }));
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
        created_at: new Date(article.created_at),
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
  return transaction(async (trx: TransactionClient) => {
    // Insert article
    const { data: articleResult, error: articleError } = await query(
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
      ],
      trx
    );

    if (articleError) throw new Error(articleError);

    // Get the inserted article ID
    const { data: insertedArticle, error: getError } = await query(
      "SELECT * FROM Articles WHERE id = LAST_INSERT_ID()",
      [],
      trx
    );

    if (getError) throw new Error(getError);
    const newArticle = insertedArticle?.[0];

    // Insert article tags
    if (tag_ids.length > 0) {
      const placeholders = tag_ids.map(() => "(?, ?)").join(",");
      const values = tag_ids.flatMap((tagId) => [newArticle.id, tagId]);

      const { error: tagError } = await query(
        `INSERT INTO Article_Tags (article_id, tag_id) VALUES ${placeholders}`,
        values,
        trx
      );

      if (tagError) throw new Error(tagError);
    }

    // Insert image into Images table if present
    if (article.image) {
      const { error: imageError } = await query(
        `INSERT INTO Images (article_id, image_url, created_at) 
         VALUES (?, ?, NOW())`,
        [newArticle.id, article.image],
        trx
      );

      if (imageError) throw new Error(imageError);
    }

    // Insert video into Videos table if present
    if (article.video) {
      const { error: videoError } = await query(
        `INSERT INTO Videos (article_id, video_url, created_at) 
         VALUES (?, ?, NOW())`,
        [newArticle.id, article.video],
        trx
      );

      if (videoError) throw new Error(videoError);
    }

    return newArticle;
  });
}

export async function updateArticle(
  id: number,
  article: Partial<Article>,
  tag_ids?: number[]
) {
  return transaction(async (trx: TransactionClient) => {
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

    const { error: articleError } = await query(
      `UPDATE Articles SET ${setClauses}, updated_at = NOW() WHERE id = ?`,
      [...Object.values(articleData), id],
      trx
    );

    if (articleError) throw new Error(articleError);

    // Handle image update
    if (article.image) {
      // Check if an image record already exists for this article
      const { data: existingImage } = await query(
        "SELECT id FROM Images WHERE article_id = ?",
        [id],
        trx
      );

      if (existingImage && existingImage.length > 0) {
        // Update existing image record
        const { error: imageError } = await query(
          "UPDATE Images SET image_url = ?, updated_at = NOW() WHERE article_id = ?",
          [article.image, id],
          trx
        );
        if (imageError) throw new Error(imageError);
      } else {
        // Insert new image record
        const { error: imageError } = await query(
          "INSERT INTO Images (article_id, image_url, created_at) VALUES (?, ?, NOW())",
          [id, article.image],
          trx
        );
        if (imageError) throw new Error(imageError);
      }
    }

    // Handle video update
    if (article.video) {
      // Check if a video record already exists for this article
      const { data: existingVideo } = await query(
        "SELECT id FROM Videos WHERE article_id = ?",
        [id],
        trx
      );

      if (existingVideo && existingVideo.length > 0) {
        // Update existing video record
        const { error: videoError } = await query(
          "UPDATE Videos SET video_url = ?, updated_at = NOW() WHERE article_id = ?",
          [article.video, id],
          trx
        );
        if (videoError) throw new Error(videoError);
      } else {
        // Insert new video record
        const { error: videoError } = await query(
          "INSERT INTO Videos (article_id, video_url, created_at) VALUES (?, ?, NOW())",
          [id, article.video],
          trx
        );
        if (videoError) throw new Error(videoError);
      }
    }

    // Update tags if provided
    if (tag_ids !== undefined) {
      // Delete existing tags
      await query("DELETE FROM Article_Tags WHERE article_id = ?", [id], trx);

      // Insert new tags
      if (tag_ids.length > 0) {
        const placeholders = tag_ids.map(() => "(?, ?)").join(",");
        const values = tag_ids.flatMap((tagId) => [id, tagId]);

        const { error: tagError } = await query(
          `INSERT INTO Article_Tags (article_id, tag_id) VALUES ${placeholders}`,
          values,
          trx
        );

        if (tagError) throw new Error(tagError);
      }
    }

    // Get the updated article
    const { data: updatedArticle, error: getError } = await query(
      "SELECT * FROM Articles WHERE id = ?",
      [id],
      trx
    );

    if (getError) throw new Error(getError);

    return updatedArticle?.[0];
  });
}

export async function deleteArticle(id: number) {
  return transaction(async (trx: TransactionClient) => {
    try {
      // Delete article tags first
      await query("DELETE FROM Article_Tags WHERE article_id = ?", [id], trx);

      // Delete associated images
      const { error: imageError } = await query(
        "DELETE FROM Images WHERE article_id = ?",
        [id],
        trx
      );
      if (imageError) throw new Error(imageError);

      // Delete associated videos
      const { error: videoError } = await query(
        "DELETE FROM Videos WHERE article_id = ?",
        [id],
        trx
      );
      if (videoError) throw new Error(videoError);

      // Delete article
      const { data: result, error } = await query(
        "DELETE FROM Articles WHERE id = ?",
        [id],
        trx
      );

      if (error) throw new Error(error);
      return result?.[0];
    } catch (error) {
      console.error("Error deleting article:", error);
      throw error;
    }
  });
}
