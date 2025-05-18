"use server";

import { AuthorFormData } from "../validations/authorSchema";
import { Author } from "../../lib/definition";
import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { RowDataPacket } from "mysql2";
import { transaction } from "../db/query";

interface AuthorRow extends RowDataPacket {
  id: number;
  name: string;
  description: string | null;
  bio: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function getAuthorById(
  id: number
): Promise<{ data?: Author; error?: string }> {
  try {
    const result = await query(
      "SELECT id, name, description, bio, created_at, updated_at FROM Authors WHERE id = ?",
      [id]
    );

    if (result.error) {
      return { error: result.error };
    }

    const authors = result.data as AuthorRow[];
    if (!authors || authors.length === 0) {
      return { error: "Author not found" };
    }

    const authorData = authors[0];
    const author: Author = {
      id: authorData.id,
      name: authorData.name,
      description: authorData.description || undefined,
      bio: authorData.bio || undefined,
      created_at: authorData.created_at.toISOString(),
      updated_at: authorData.updated_at.toISOString(),
    };

    return { data: author };
  } catch (error) {
    console.error("Error getting author by ID:", error);
    return { error: "Failed to get author" };
  }
}

export async function getAuthors(page = 1, limit = 10) {
  try {
    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total 
      FROM Authors
    `);

    if (countResult.error || !countResult.data) {
      return {
        data: null,
        total: 0,
        error: countResult.error || "Failed to get total count",
      };
    }

    // Get paginated data with articles count
    const result = await query(
      `
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM Articles ar WHERE ar.author_id = a.id) as articles_count
      FROM Authors a
      ORDER BY a.name ASC
      LIMIT ? OFFSET ?
    `,
      [limit, (page - 1) * limit]
    );

    if (result.error || !result.data) {
      return {
        data: null,
        total: 0,
        error: result.error || "No data found",
      };
    }

    const total = (countResult.data[0] as { total: number }).total;
    return {
      data: result.data as Author[],
      total,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching authors:", error);
    return {
      data: null,
      total: 0,
      error: "Failed to fetch authors",
    };
  }
}

export async function createAuthor(authorData: AuthorFormData) {
  try {
    const result = await query(
      "INSERT INTO Authors (name, description, bio, created_at) VALUES (?, ?, ?, NOW())",
      [authorData.name, authorData.description || null, authorData.bio || null]
    );

    if (result.error) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/authors");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error creating author:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create author",
    };
  }
}

export async function updateAuthor(id: number, authorData: AuthorFormData) {
  try {
    const result = await query(
      "UPDATE Authors SET name = ?, description = ?, bio = ? WHERE id = ?",
      [
        authorData.name,
        authorData.description || null,
        authorData.bio || null,
        id,
      ]
    );

    if (result.error) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/authors");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating author:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update author",
    };
  }
}

export async function deleteAuthor(id: number) {
  try {
    // First check if the author exists
    const authorCheck = await query("SELECT id FROM Authors WHERE id = ?", [
      id,
    ]);
    if (authorCheck.error) {
      return {
        success: false,
        error: `Database error checking author: ${authorCheck.error}`,
      };
    }

    if (
      !authorCheck.data ||
      (Array.isArray(authorCheck.data) && authorCheck.data.length === 0)
    ) {
      return { success: false, error: "Author not found" };
    }

    // Check for associated articles
    const articlesCheck = await query(
      "SELECT COUNT(*) as count FROM Articles WHERE author_id = ?",
      [id]
    );

    if (articlesCheck.error) {
      return {
        success: false,
        error: `Database error checking articles: ${articlesCheck.error}`,
      };
    }

    const articleCount = (articlesCheck.data as any[])[0].count;
    if (articleCount > 0) {
      return {
        success: false,
        error:
          "Cannot delete author because they have associated articles. Please reassign or delete these articles first.",
      };
    }

    // Try to delete the author
    const result = await query("DELETE FROM Authors WHERE id = ?", [id]);

    if (result.error) {
      return { success: false, error: `Database error: ${result.error}` };
    }

    revalidatePath("/dashboard/authors");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error in deleteAuthor:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete author",
    };
  }
}

export async function searchAuthors(searchQuery: string, page = 1, limit = 10) {
  try {
    if (!searchQuery.trim()) {
      return getAuthors(page, limit);
    }

    // Get total count for search results
    const countResult = await query(
      "SELECT COUNT(*) as total FROM Authors WHERE name LIKE ? OR description LIKE ? OR bio LIKE ?",
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
    );

    if (countResult.error || !countResult.data) {
      return {
        data: [],
        error: countResult.error || "Failed to get total count",
      };
    }

    // Get paginated search results
    const result = await query(
      "SELECT * FROM Authors WHERE name LIKE ? OR description LIKE ? OR bio LIKE ? ORDER BY name LIMIT ? OFFSET ?",
      [
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        limit,
        (page - 1) * limit,
      ]
    );

    if (result.error || !result.data) {
      return {
        data: [],
        error: result.error || "Failed to get search results",
      };
    }

    const authors = result.data as AuthorRow[];
    const total = (countResult.data[0] as { total: number }).total;

    return {
      data: authors.map((author) => ({
        id: author.id,
        name: author.name,
        description: author.description || undefined,
        bio: author.bio || undefined,
        created_at: author.created_at.toISOString(),
        updated_at: author.updated_at.toISOString(),
      })),
      total,
      error: null,
    };
  } catch (error) {
    console.error("Error searching authors:", error);
    return { data: [], error: "Failed to search authors" };
  }
}
