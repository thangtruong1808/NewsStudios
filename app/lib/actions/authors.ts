"use server";

import { connectToDatabase } from "../db";
import { AuthorFormData } from "../validations/authorSchema";
import { Author } from "../../type/definitions";
import { revalidatePath } from "next/cache";
import { query } from "../db/db";

export async function getAuthors() {
  try {
    const result = await query("SELECT * FROM Authors ORDER BY name ASC");
    return { data: result, error: null };
  } catch (error) {
    console.error("Error fetching authors:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch authors",
    };
  }
}

export async function createAuthor(authorData: AuthorFormData) {
  try {
    const { db } = await connectToDatabase();
    await db.query(
      "INSERT INTO Authors (name, description, bio, created_at) VALUES (?, ?, ?, NOW())",
      [authorData.name, authorData.description || null, authorData.bio || null]
    );
    await db.end();
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
    const { db } = await connectToDatabase();
    await db.query(
      "UPDATE Authors SET name = ?, description = ?, bio = ? WHERE id = ?",
      [
        authorData.name,
        authorData.description || null,
        authorData.bio || null,
        id,
      ]
    );
    await db.end();
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
    const { db } = await connectToDatabase();
    await db.query("DELETE FROM Authors WHERE id = ?", [id]);
    await db.end();
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting author:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete author",
    };
  }
}

export async function getAuthorById(id: number) {
  try {
    const { db } = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM Authors WHERE id = ?", [id]);
    await db.end();

    if (Array.isArray(rows) && rows.length > 0) {
      return { data: rows[0] as Author, error: null };
    } else {
      return { data: null, error: "Author not found" };
    }
  } catch (error) {
    console.error("Error fetching author:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch author",
    };
  }
}
