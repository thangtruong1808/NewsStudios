"use server";

import { AuthorFormData } from "../validations/authorSchema";
import { Author } from "../../login/login-definitions";
import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { RowDataPacket } from "mysql2";

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

export async function getAuthors() {
  try {
    const result = await query("SELECT * FROM Authors ORDER BY name");
    if (result.error) {
      return { data: [], error: result.error };
    }
    const authors = result.data as AuthorRow[];
    return {
      data: authors.map((author) => ({
        id: author.id,
        name: author.name,
        description: author.description || undefined,
        bio: author.bio || undefined,
        created_at: author.created_at.toISOString(),
        updated_at: author.updated_at.toISOString(),
      })),
      error: null,
    };
  } catch (error) {
    console.error("Error in getAuthors:", error);
    return { data: [], error: "Failed to fetch authors" };
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
    const result = await query("DELETE FROM Authors WHERE id = ?", [id]);

    if (result.error) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/authors");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting author:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete author",
    };
  }
}

export async function searchAuthors(searchQuery: string) {
  try {
    if (!searchQuery.trim()) {
      return getAuthors();
    }

    const result = await query(
      "SELECT * FROM Authors WHERE name LIKE ? OR description LIKE ? OR bio LIKE ? ORDER BY name",
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
    );

    if (result.error) {
      return { data: [], error: result.error };
    }

    const authors = result.data as AuthorRow[];
    return {
      data: authors.map((author) => ({
        id: author.id,
        name: author.name,
        description: author.description || undefined,
        bio: author.bio || undefined,
        created_at: author.created_at.toISOString(),
        updated_at: author.updated_at.toISOString(),
      })),
      error: null,
    };
  } catch (error) {
    console.error("Error searching authors:", error);
    return { data: [], error: "Failed to search authors" };
  }
}
