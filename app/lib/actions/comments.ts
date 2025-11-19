"use server";

import { query } from "../db/query";
import { Comment } from "../definition";
import { resolveTableName } from "../db/tableNameResolver";
import { getAuthSession } from "../auth";
import { revalidatePath } from "next/cache";

// Component Info
// Description: Server actions for comment CRUD operations and queries.
// Date created: 2025-01-27
// Author: thangtruong

interface GetCommentsParams {
  article_id: number;
  page?: number;
  limit?: number;
}

// Get comments for an article
export async function getComments({
  article_id,
  page = 1,
  limit = 10,
}: GetCommentsParams) {
  try {
    const commentsTable = await resolveTableName("Comments");
    if (!commentsTable) {
      return {
        data: [],
        error: "Failed to resolve table name.",
        totalCount: 0,
      };
    }

    const limitValue = Math.max(1, Number(limit) || 10);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;

    // Get total count
    const countResult = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM \`${commentsTable}\` WHERE article_id = ?`,
      [article_id]
    );

    const totalCount =
      countResult.data && Array.isArray(countResult.data)
        ? Number((countResult.data[0] as { count: number }).count ?? 0)
        : 0;

    // Resolve Users table name
    const usersTable = await resolveTableName("Users");
    if (!usersTable) {
      return {
        data: [],
        error: "Failed to resolve Users table name.",
        totalCount: 0,
      };
    }

    // Get paginated comments with user info
    const result = await query<
      Comment & {
        user_firstname?: string;
        user_lastname?: string;
        user_email?: string;
      }
    >(
      `SELECT 
        c.*,
        u.firstname as user_firstname,
        u.lastname as user_lastname,
        u.email as user_email
      FROM \`${commentsTable}\` c
      LEFT JOIN \`${usersTable}\` u ON c.user_id = u.id
      WHERE c.article_id = ?
      ORDER BY c.created_at DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}`,
      [article_id]
    );

    if (result.error || !result.data) {
      return {
        data: [],
        error: result.error ?? "Failed to fetch comments",
        totalCount: 0,
      };
    }

    const comments = Array.isArray(result.data)
      ? (result.data as Array<
          Comment & {
            user_firstname?: string;
            user_lastname?: string;
            user_email?: string;
          }
        >).map((comment) => ({
          id: Number(comment.id),
          article_id: Number(comment.article_id),
          user_id: Number(comment.user_id),
          content: String(comment.content),
          created_at: new Date(comment.created_at),
          updated_at: new Date(comment.updated_at),
          user_name: comment.user_firstname && comment.user_lastname
            ? `${comment.user_firstname} ${comment.user_lastname}`
            : comment.user_email || "Anonymous",
          user_firstname: comment.user_firstname || "",
          user_lastname: comment.user_lastname || "",
        }))
      : [];

    return {
      data: comments,
      error: null,
      totalCount,
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch comments",
      totalCount: 0,
    };
  }
}

// Create a new comment
export async function createComment(article_id: number, content: string) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return {
        data: null,
        error: "Authentication required. Please login to comment.",
      };
    }

    const commentsTable = await resolveTableName("Comments");
    const usersTable = await resolveTableName("Users");
    if (!commentsTable || !usersTable) {
      return {
        data: null,
        error: "Failed to resolve table name.",
      };
    }

    const trimmedContent = content.trim();
    if (!trimmedContent || trimmedContent.length === 0) {
      return {
        data: null,
        error: "Comment content cannot be empty.",
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
    const result = await query(
      `INSERT INTO \`${commentsTable}\` (article_id, user_id, content, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [article_id, userId, trimmedContent]
    );

    if (result.error || !result.data) {
      return {
        data: null,
        error: result.error ?? "Failed to create comment",
      };
    }

    const insertId = (result.data as any).insertId;
    if (!insertId) {
      return {
        data: null,
        error: "Failed to create comment",
      };
    }

    revalidatePath(`/articles/${article_id}`);
    return {
      data: { id: insertId },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create comment",
    };
  }
}

// Update a comment
export async function updateComment(comment_id: number, content: string) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return {
        data: null,
        error: "Authentication required.",
      };
    }

    const commentsTable = await resolveTableName("Comments");
    if (!commentsTable) {
      return {
        data: null,
        error: "Failed to resolve table name.",
      };
    }

    const trimmedContent = content.trim();
    if (!trimmedContent || trimmedContent.length === 0) {
      return {
        data: null,
        error: "Comment content cannot be empty.",
      };
    }

    const userId = Number(session.user.id);

    // Check if comment exists and belongs to user
    const checkResult = await query<Comment>(
      `SELECT * FROM \`${commentsTable}\` WHERE id = ? AND user_id = ?`,
      [comment_id, userId]
    );

    if (
      checkResult.error ||
      !checkResult.data ||
      !Array.isArray(checkResult.data) ||
      checkResult.data.length === 0
    ) {
      return {
        data: null,
        error: "Comment not found or you don't have permission to edit it.",
      };
    }

    const articleId = Number((checkResult.data[0] as Comment).article_id);

    const result = await query(
      `UPDATE \`${commentsTable}\` SET content = ?, updated_at = NOW() WHERE id = ? AND user_id = ?`,
      [trimmedContent, comment_id, userId]
    );

    if (result.error) {
      return {
        data: null,
        error: result.error ?? "Failed to update comment",
      };
    }

    revalidatePath(`/articles/${articleId}`);
    return {
      data: { id: comment_id },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update comment",
    };
  }
}

// Delete a comment
export async function deleteComment(comment_id: number) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return {
        data: null,
        error: "Authentication required.",
      };
    }

    const commentsTable = await resolveTableName("Comments");
    if (!commentsTable) {
      return {
        data: null,
        error: "Failed to resolve table name.",
      };
    }

    const userId = Number(session.user.id);

    // Get article_id before deleting
    const checkResult = await query<Comment>(
      `SELECT article_id FROM \`${commentsTable}\` WHERE id = ?`,
      [comment_id]
    );

    const articleId =
      checkResult.data &&
      Array.isArray(checkResult.data) &&
      checkResult.data.length > 0
        ? Number((checkResult.data[0] as Comment).article_id)
        : null;

    // Delete comment (users can delete their own comments, admins can delete any)
    const result = await query(
      `DELETE FROM \`${commentsTable}\` WHERE id = ? AND user_id = ?`,
      [comment_id, userId]
    );

    if (result.error) {
      return {
        data: null,
        error: result.error ?? "Failed to delete comment",
      };
    }

    if (articleId) {
      revalidatePath(`/articles/${articleId}`);
    }
    return {
      data: { id: comment_id },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete comment",
    };
  }
}

