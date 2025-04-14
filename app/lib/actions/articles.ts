"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { RowDataPacket } from "mysql2";
import { Article } from "../definition";

export interface ArticleWithJoins
  extends Article,
    RowDataPacket {
  category_name?: string;
  author_name?: string;
  user_firstname?: string;
  user_lastname?: string;
}

export async function getArticles() {
  try {
    const result = await query(`
      SELECT a.*, c.name as category_name, au.name as author_name, u.firstname as user_firstname, u.lastname as user_lastname
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN Authors au ON a.author_id = au.id
      LEFT JOIN Users u ON a.user_id = u.id
      ORDER BY a.published_at DESC
    `);

    if (result.error) {
      console.error("Error in getArticles:", result.error);
      return { error: result.error };
    }

    return { data: result.data || [] };
  } catch (error) {
    console.error("Error in getArticles:", error);
    try {
      // Fallback to simpler query if join fails
      const fallbackResult = await query(
        "SELECT * FROM Articles ORDER BY published_at DESC"
      );

      if (fallbackResult.error) {
        console.error(
          "Error in getArticles fallback:",
          fallbackResult.error
        );
        return { error: fallbackResult.error };
      }

      return { data: fallbackResult.data || [] };
    } catch (fallbackError) {
      console.error(
        "Error in getArticles fallback:",
        fallbackError
      );
      return { error: "Failed to fetch articles" };
    }
  }
}

export async function getArticleById(id: number) {
  try {
    const result = await query(
      `
      SELECT a.*, c.name as category_name, au.name as author_name, u.firstname as user_firstname, u.lastname as user_lastname
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN Authors au ON a.author_id = au.id
      LEFT JOIN Users u ON a.user_id = u.id
      WHERE a.id = ?
    `,
      [id]
    );

    if (result.error) {
      console.error(
        "Error fetching article:",
        result.error
      );
      return { data: null, error: result.error };
    }

    const articles = result.data as ArticleWithJoins[];
    return { data: articles?.[0] || null, error: null };
  } catch (error) {
    console.error("Error fetching article:", error);
    return { data: null, error: "Failed to fetch article" };
  }
}

type CreateArticleData = Omit<
  Article,
  "id" | "published_at" | "updated_at"
> & {
  tag_ids?: number[];
};

export async function createArticle(
  data: CreateArticleData
) {
  try {
    // Validate required fields
    if (!data.title || data.title.trim() === "") {
      return { error: "Title is required" };
    }

    if (!data.content || data.content.trim() === "") {
      return { error: "Content is required" };
    }

    if (!data.category_id) {
      return { error: "Category is required" };
    }

    if (!data.author_id) {
      return { error: "Author is required" };
    }

    if (!data.user_id) {
      return { error: "User is required" };
    }

    // Check if category exists
    const categoryResult = await query(
      "SELECT id FROM Categories WHERE id = ?",
      [data.category_id]
    );

    if (
      categoryResult.error ||
      !categoryResult.data ||
      (Array.isArray(categoryResult.data) &&
        categoryResult.data.length === 0)
    ) {
      return { error: "Selected category does not exist" };
    }

    // Check if author exists
    const authorResult = await query(
      "SELECT id FROM Authors WHERE id = ?",
      [data.author_id]
    );

    if (
      authorResult.error ||
      !authorResult.data ||
      (Array.isArray(authorResult.data) &&
        authorResult.data.length === 0)
    ) {
      return { error: "Selected author does not exist" };
    }

    // Check if user exists
    const userResult = await query(
      "SELECT id FROM Users WHERE id = ?",
      [data.user_id]
    );

    if (
      userResult.error ||
      !userResult.data ||
      (Array.isArray(userResult.data) &&
        userResult.data.length === 0)
    ) {
      return { error: "Selected user does not exist" };
    }

    // Check if subcategory exists if provided
    if (data.sub_category_id) {
      const subcategoryResult = await query(
        "SELECT id FROM SubCategories WHERE id = ?",
        [data.sub_category_id]
      );

      if (
        subcategoryResult.error ||
        !subcategoryResult.data ||
        (Array.isArray(subcategoryResult.data) &&
          subcategoryResult.data.length === 0)
      ) {
        return {
          error: "Selected subcategory does not exist",
        };
      }
    }

    // Start transaction
    const transactionResult = await query(
      "START TRANSACTION"
    );
    if (transactionResult.error) {
      return { error: "Failed to start transaction" };
    }

    try {
      // Insert article
      const insertResult = await query(
        `INSERT INTO Articles (
          title, content, category_id, author_id, user_id, sub_category_id,
          image, video, is_featured, headline_priority, headline_image_url,
          headline_video_url, is_trending, published_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          data.title,
          data.content,
          data.category_id,
          data.author_id,
          data.user_id,
          data.sub_category_id || null,
          data.image || null,
          data.video || null,
          data.is_featured || false,
          data.headline_priority || 0,
          data.headline_image_url || null,
          data.headline_video_url || null,
          data.is_trending || false,
        ]
      );

      if (insertResult.error) {
        throw new Error(insertResult.error);
      }

      const articleId = (insertResult.data as any).insertId;

      // Insert tag associations if tags are provided
      if (data.tag_ids && data.tag_ids.length > 0) {
        const placeholders = data.tag_ids
          .map(() => "(?, ?)")
          .join(", ");
        const flatValues = data.tag_ids.flatMap(
          (tagId: number) => [articleId, tagId]
        );
        const tagInsertResult = await query(
          `INSERT INTO Article_Tags (article_id, tag_id) VALUES ${placeholders}`,
          flatValues
        );

        if (tagInsertResult.error) {
          throw new Error(tagInsertResult.error);
        }
      }

      // Commit transaction
      const commitResult = await query("COMMIT");
      if (commitResult.error) {
        throw new Error(commitResult.error);
      }

      // Revalidate the articles path
      revalidatePath("/dashboard/articles");

      // Get the created article
      const { data: createdArticle, error: fetchError } =
        await getArticleById(articleId);
      if (fetchError) {
        console.error(
          "Error fetching created article:",
          fetchError
        );
        return {
          error:
            "Article created but failed to fetch details",
        };
      }

      return { data: createdArticle, error: null };
    } catch (error) {
      // Rollback transaction on error
      const rollbackResult = await query("ROLLBACK");
      if (rollbackResult.error) {
        console.error(
          "Error rolling back transaction:",
          rollbackResult.error
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error creating article:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create article",
    };
  }
}
