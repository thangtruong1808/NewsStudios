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

type AuthorCountResultRow = {
  count: number;
} & Record<string, unknown>;

type AuthorListRow = Author & {
  articles_count?: number | string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

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

export async function getAuthors({
  page = 1,
  limit = 10,
  search = "",
  sortField = "created_at",
  sortDirection = "desc",
}: {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
} = {}) {
  try {
    const offset = (page - 1) * limit;
    const searchCondition = search
      ? `WHERE a.name LIKE ? OR a.description LIKE ? OR a.bio LIKE ?`
      : "";
    const searchParams = search
      ? [`%${search}%`, `%${search}%`, `%${search}%`]
      : [];

    // Handle special sorting for computed fields
    let orderBy;
    if (sortField === "articles_count") {
      orderBy = `ORDER BY (SELECT COUNT(*) FROM Articles ar WHERE ar.author_id = a.id) ${sortDirection}`;
    } else {
      orderBy = `ORDER BY a.${sortField} ${sortDirection}`;
    }

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as count
      FROM Authors a
      ${searchCondition}
    `;
    const countResult = await query<AuthorCountResultRow>(countQuery, searchParams);
    if (countResult.error || !countResult.data) {
      throw new Error(countResult.error || "Failed to get count");
    }
    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as AuthorCountResultRow[])
      : [];
    const totalItems = countRows.length > 0 ? Number(countRows[0].count ?? 0) : 0;
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated data with articles count
    const dataQuery = `
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM Articles ar WHERE ar.author_id = a.id) as articles_count
      FROM Authors a
      ${searchCondition}
      ${orderBy}
      LIMIT ? 
      OFFSET ?
    `;

    const result = await query<AuthorListRow>(dataQuery, [
      ...searchParams,
      limit,
      offset,
    ]);

    if (result.error || !result.data) {
      throw new Error(result.error || "Failed to fetch data");
    }

    // Convert the counts to numbers and ensure proper data types
    const rows = Array.isArray(result.data)
      ? (result.data as AuthorListRow[])
      : [];

    const authors = rows.map((author) => ({
      ...author,
      articles_count: Number(author.articles_count ?? 0),
      created_at:
        typeof author.created_at === "string"
          ? author.created_at
          : new Date(author.created_at).toISOString(),
      updated_at:
        typeof author.updated_at === "string"
          ? author.updated_at
          : new Date(author.updated_at).toISOString(),
    }));

    return {
      data: authors as Author[],
      error: null,
      totalItems,
      totalPages,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      data: null,
      error: "Failed to fetch authors.",
      totalItems: 0,
      totalPages: 0,
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

export async function searchAuthors({
  search,
  page = 1,
  limit = 10,
  sortField = "created_at",
  sortDirection = "desc",
}: {
  search: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}) {
  try {
    const offset = (page - 1) * limit;
    const searchCondition = `WHERE a.name LIKE ? OR a.description LIKE ? OR a.bio LIKE ?`;
    const searchParams = [`%${search}%`, `%${search}%`, `%${search}%`];

    // Handle special sorting for computed fields
    let orderBy;
    if (sortField === "articles_count") {
      orderBy = `ORDER BY (SELECT COUNT(*) FROM Articles ar WHERE ar.author_id = a.id) ${sortDirection}`;
    } else {
      orderBy = `ORDER BY a.${sortField} ${sortDirection}`;
    }

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as count
      FROM Authors a
      ${searchCondition}
    `;
    const countResult = await query<AuthorCountResultRow>(
      countQuery,
      searchParams
    );
    if (countResult.error || !countResult.data) {
      throw new Error(countResult.error || "Failed to get count");
    }
    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as AuthorCountResultRow[])
      : [];
    const totalItems =
      countRows.length > 0 ? Number(countRows[0].count ?? 0) : 0;
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated data with articles count
    const dataQuery = `
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM Articles ar WHERE ar.author_id = a.id) as articles_count
      FROM Authors a
      ${searchCondition}
      ${orderBy}
      LIMIT ? 
      OFFSET ?
    `;

    const result = await query<AuthorListRow>(dataQuery, [
      ...searchParams,
      limit,
      offset,
    ]);

    if (result.error || !result.data) {
      throw new Error(result.error || "Failed to fetch data");
    }

    // Convert the counts to numbers and ensure proper data types
    const rows = Array.isArray(result.data)
      ? (result.data as AuthorListRow[])
      : [];

    const authors = rows.map((author) => ({
      ...author,
      articles_count: Number(author.articles_count ?? 0),
      created_at:
        typeof author.created_at === "string"
          ? author.created_at
          : new Date(author.created_at).toISOString(),
      updated_at:
        typeof author.updated_at === "string"
          ? author.updated_at
          : new Date(author.updated_at).toISOString(),
    }));

    return {
      data: authors as Author[],
      error: null,
      totalItems,
      totalPages,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      data: null,
      error: "Failed to search authors.",
      totalItems: 0,
      totalPages: 0,
    };
  }
}
