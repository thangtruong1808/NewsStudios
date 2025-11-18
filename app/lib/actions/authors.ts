"use server";

// Component Info
// Description: Server actions for author CRUD operations and queries.
// Date created: 2025-11-18
// Author: thangtruong

import { AuthorFormData } from "../validations/authorSchema";
import { Author } from "../../lib/definition";
import { revalidatePath } from "next/cache";
import { query } from "../db/query";
import { resolveTableName } from "../db/tableNameResolver";
import { RowDataPacket } from "mysql2";

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
    // Resolve table name with proper casing
    const authorsTable = await resolveTableName("Authors");
    
    // Validate table name is resolved
    if (!authorsTable) {
      return { error: "Failed to resolve table name." };
    }

    const result = await query(
      `SELECT id, name, description, bio, created_at, updated_at FROM \`${authorsTable}\` WHERE id = ?`,
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
    return {
      error:
        error instanceof Error ? error.message : "Failed to get author",
    };
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
    // Resolve table names with proper casing
    const [authorsTable, articlesTable] = await Promise.all([
      resolveTableName("Authors"),
      resolveTableName("Articles"),
    ]);

    // Validate table names are resolved
    if (!authorsTable || !articlesTable) {
      return {
        data: null,
        error: "Failed to resolve table names.",
        totalItems: 0,
        totalPages: 0,
      };
    }

    const limitValue = Math.max(1, Number(limit) || 10);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;
    const searchable = search.trim();
    const searchCondition = searchable
      ? `WHERE a.name LIKE ? OR a.description LIKE ? OR a.bio LIKE ?`
      : "";
    const searchParams = searchable
      ? [`%${searchable}%`, `%${searchable}%`, `%${searchable}%`]
      : [];

    // Handle special sorting for computed fields
    let orderBy;
    if (sortField === "articles_count") {
      orderBy = `ORDER BY (SELECT COUNT(*) FROM \`${articlesTable}\` ar WHERE ar.author_id = a.id) ${sortDirection}`;
    } else {
      orderBy = `ORDER BY a.${sortField} ${sortDirection}`;
    }

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as count
      FROM \`${authorsTable}\` a
      ${searchCondition}
    `;
    const countResult = await query<AuthorCountResultRow>(countQuery, searchParams);

    if (countResult.error || !countResult.data) {
      return {
        data: null,
        error: countResult.error ?? "Failed to fetch authors.",
        totalItems: 0,
        totalPages: 0,
      };
    }

    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as AuthorCountResultRow[])
      : [];
    const totalItems = countRows.length > 0 ? Number(countRows[0].count ?? 0) : 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / limitValue));

    // Get paginated data with articles count
    const dataQuery = `
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM \`${articlesTable}\` ar WHERE ar.author_id = a.id) as articles_count
      FROM \`${authorsTable}\` a
      ${searchCondition}
      ${orderBy}
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `;

    const result = await query<AuthorListRow>(dataQuery, searchParams);

    if (result.error || !result.data) {
      return {
        data: null,
        error: result.error ?? "Failed to fetch authors.",
        totalItems,
        totalPages,
      };
    }

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
    })) as Author[];

    return {
      data: authors,
      error: null,
      totalItems,
      totalPages,
    };
  } catch (_error) {
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
    // Resolve table name with proper casing
    const authorsTable = await resolveTableName("Authors");
    
    // Validate table name is resolved
    if (!authorsTable) {
      return { success: false, error: "Failed to resolve table name." };
    }

    const result = await query(
      `INSERT INTO \`${authorsTable}\` (name, description, bio, created_at) VALUES (?, ?, ?, NOW())`,
      [authorData.name, authorData.description || null, authorData.bio || null]
    );

    if (result.error) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/authors");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create author",
    };
  }
}

export async function updateAuthor(id: number, authorData: AuthorFormData) {
  try {
    // Resolve table name with proper casing
    const authorsTable = await resolveTableName("Authors");
    
    // Validate table name is resolved
    if (!authorsTable) {
      return { success: false, error: "Failed to resolve table name." };
    }

    const result = await query(
      `UPDATE \`${authorsTable}\` SET name = ?, description = ?, bio = ? WHERE id = ?`,
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
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update author",
    };
  }
}

export async function deleteAuthor(id: number) {
  try {
    // Resolve table names with proper casing
    const [authorsTable, articlesTable] = await Promise.all([
      resolveTableName("Authors"),
      resolveTableName("Articles"),
    ]);

    // Validate table names are resolved
    if (!authorsTable || !articlesTable) {
      return { success: false, error: "Failed to resolve table names." };
    }

    // First check if the author exists
    const authorCheck = await query(`SELECT id FROM \`${authorsTable}\` WHERE id = ?`, [
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
      `SELECT COUNT(*) as count FROM \`${articlesTable}\` WHERE author_id = ?`,
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
    const result = await query(`DELETE FROM \`${authorsTable}\` WHERE id = ?`, [id]);

    if (result.error) {
      return { success: false, error: `Database error: ${result.error}` };
    }

    revalidatePath("/dashboard/authors");
    return { success: true, error: null };
  } catch (error) {
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
    // Resolve table names with proper casing
    const [authorsTable, articlesTable] = await Promise.all([
      resolveTableName("Authors"),
      resolveTableName("Articles"),
    ]);

    // Validate table names are resolved
    if (!authorsTable || !articlesTable) {
      return {
        data: null,
        error: "Failed to resolve table names.",
        totalItems: 0,
        totalPages: 0,
      };
    }

    const limitValue = Math.max(1, Number(limit) || 10);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;
    const searchable = search.trim();
    const searchCondition = searchable
      ? `WHERE a.name LIKE ? OR a.description LIKE ? OR a.bio LIKE ?`
      : "";
    const searchParams = searchable
      ? [`%${searchable}%`, `%${searchable}%`, `%${searchable}%`]
      : [];

    // Handle special sorting for computed fields
    let orderBy;
    if (sortField === "articles_count") {
      orderBy = `ORDER BY (SELECT COUNT(*) FROM \`${articlesTable}\` ar WHERE ar.author_id = a.id) ${sortDirection}`;
    } else {
      orderBy = `ORDER BY a.${sortField} ${sortDirection}`;
    }

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as count
      FROM \`${authorsTable}\` a
      ${searchCondition}
    `;
    const countResult = await query<AuthorCountResultRow>(countQuery, searchParams);

    if (countResult.error || !countResult.data) {
      return {
        data: null,
        error: countResult.error ?? "Failed to fetch authors.",
        totalItems: 0,
        totalPages: 0,
      };
    }

    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as AuthorCountResultRow[])
      : [];
    const totalItems = countRows.length > 0 ? Number(countRows[0].count ?? 0) : 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / limitValue));

    // Get paginated data with articles count
    const dataQuery = `
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM \`${articlesTable}\` ar WHERE ar.author_id = a.id) as articles_count
      FROM \`${authorsTable}\` a
      ${searchCondition}
      ${orderBy}
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `;

    const result = await query<AuthorListRow>(dataQuery, searchParams);

    if (result.error || !result.data) {
      return {
        data: null,
        error: result.error ?? "Failed to fetch authors.",
        totalItems,
        totalPages,
      };
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
    })) as Author[];

    return {
      data: authors,
      error: null,
      totalItems,
      totalPages,
    };
  } catch (_error) {
    return {
      data: null,
      error: "Failed to fetch authors.",
      totalItems: 0,
      totalPages: 0,
    };
  }
}
