"use server";

import { query } from "../db/query";
import { resolveTableName } from "../db/tableNameResolver";
import { getAuthSession } from "../auth";
import { revalidatePath } from "next/cache";

// Component Info
// Description: Server actions for like/unlike operations on articles.
// Date created: 2025-01-27
// Author: thangtruong

// Check if user has liked an article
export async function checkUserLiked(article_id: number) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return {
        data: false,
        error: null,
      };
    }

    const likesTable = await resolveTableName("Likes");
    if (!likesTable) {
      return {
        data: false,
        error: "Failed to resolve table name.",
      };
    }

    const userId = Number(session.user.id);
    const result = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM \`${likesTable}\` WHERE article_id = ? AND user_id = ?`,
      [article_id, userId]
    );

    if (result.error || !result.data) {
      return {
        data: false,
        error: result.error ?? "Failed to check like status",
      };
    }

    const countRows = Array.isArray(result.data)
      ? (result.data as Array<{ count: number }>)
      : [];
    const count = countRows.length > 0 ? Number(countRows[0]?.count ?? 0) : 0;

    return {
      data: count > 0,
      error: null,
    };
  } catch (error) {
    return {
      data: false,
      error: error instanceof Error ? error.message : "Failed to check like status",
    };
  }
}

// Get likes count for an article
export async function getLikesCount(article_id: number) {
  try {
    const likesTable = await resolveTableName("Likes");
    if (!likesTable) {
      return {
        data: 0,
        error: "Failed to resolve table name.",
      };
    }

    const result = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM \`${likesTable}\` WHERE article_id = ?`,
      [article_id]
    );

    if (result.error || !result.data) {
      return {
        data: 0,
        error: result.error ?? "Failed to get likes count",
      };
    }

    const countRows = Array.isArray(result.data)
      ? (result.data as Array<{ count: number }>)
      : [];
    const count = countRows.length > 0 ? Number(countRows[0]?.count ?? 0) : 0;

    return {
      data: count,
      error: null,
    };
  } catch (error) {
    return {
      data: 0,
      error: error instanceof Error ? error.message : "Failed to get likes count",
    };
  }
}

// Toggle like (like or unlike an article)
export async function toggleLike(article_id: number) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return {
        data: null,
        error: "Authentication required. Please login to like articles.",
      };
    }

    const likesTable = await resolveTableName("Likes");
    const usersTable = await resolveTableName("Users");
    if (!likesTable || !usersTable) {
      return {
        data: null,
        error: "Failed to resolve table name.",
      };
    }

    // Validate and convert user ID
    const userId = Number(session.user.id);
    if (isNaN(userId) || userId <= 0) {
      return {
        data: null,
        error: "Invalid user ID. Please login again.",
      };
    }

    // Verify user exists in database before inserting
    const userCheckResult = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM \`${usersTable}\` WHERE id = ?`,
      [userId]
    );

    if (userCheckResult.error || !userCheckResult.data) {
      return {
        data: null,
        error: "Failed to verify user. Please try again.",
      };
    }

    const userExists = Array.isArray(userCheckResult.data) &&
      userCheckResult.data.length > 0 &&
      Number(userCheckResult.data[0]?.count ?? 0) > 0;

    if (!userExists) {
      return {
        data: null,
        error: "User not found. Please login again.",
      };
    }

    // Check if user already liked the article
    const checkResult = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM \`${likesTable}\` WHERE article_id = ? AND user_id = ?`,
      [article_id, userId]
    );

    if (checkResult.error || !checkResult.data) {
      return {
        data: null,
        error: checkResult.error ?? "Failed to check like status",
      };
    }

    const countRows = Array.isArray(checkResult.data)
      ? (checkResult.data as Array<{ count: number }>)
      : [];
    const hasLiked = countRows.length > 0 && Number(countRows[0]?.count ?? 0) > 0;

    if (hasLiked) {
      // Unlike: Delete the like
      const deleteResult = await query(
        `DELETE FROM \`${likesTable}\` WHERE article_id = ? AND user_id = ?`,
        [article_id, userId]
      );

      if (deleteResult.error) {
        return {
          data: null,
          error: deleteResult.error ?? "Failed to unlike article",
        };
      }

      revalidatePath(`/articles/${article_id}`);
      return {
        data: { liked: false },
        error: null,
      };
    } else {
      // Like: Insert the like
      const insertResult = await query(
        `INSERT INTO \`${likesTable}\` (article_id, user_id, created_at) VALUES (?, ?, NOW())`,
        [article_id, userId]
      );

      if (insertResult.error || !insertResult.data) {
        return {
          data: null,
          error: insertResult.error ?? "Failed to like article",
        };
      }

      revalidatePath(`/articles/${article_id}`);
      return {
        data: { liked: true },
        error: null,
      };
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to toggle like",
    };
  }
}

