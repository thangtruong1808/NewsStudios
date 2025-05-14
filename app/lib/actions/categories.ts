"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query } from "../db/db";
import { CategoryFormData } from "../validations/categorySchema";
import { Category } from "../definition";

interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

interface GetCategoriesResult {
  data: Category[] | null;
  error: string | null;
  totalItems: number;
  totalPages: number;
}

export async function getCategories({
  page = 1,
  limit = 10,
  search = "",
  sortField = "created_at",
  sortDirection = "desc",
}: GetCategoriesParams = {}): Promise<GetCategoriesResult> {
  try {
    const offset = (page - 1) * limit;
    const searchCondition = search
      ? `WHERE name LIKE ? OR description LIKE ?`
      : "";
    const searchParams = search ? [`%${search}%`, `%${search}%`] : [];
    const orderBy = `ORDER BY ${sortField} ${sortDirection}`;

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as count
      FROM categories 
      ${searchCondition}
    `;
    const countResult = await query(countQuery, searchParams);
    if (countResult.error || !countResult.data) {
      throw new Error(countResult.error || "Failed to get count");
    }
    const totalItems = parseInt(countResult.data[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated data
    const dataQuery = `
      SELECT * 
      FROM categories 
      ${searchCondition}
      ${orderBy}
      LIMIT ? 
      OFFSET ?
    `;

    const result = await query(dataQuery, [...searchParams, limit, offset]);

    if (result.error || !result.data) {
      throw new Error(result.error || "Failed to fetch data");
    }

    return {
      data: result.data as Category[],
      error: null,
      totalItems,
      totalPages,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      data: null,
      error: "Failed to fetch categories.",
      totalItems: 0,
      totalPages: 0,
    };
  }
}

export async function getCategoryById(id: number) {
  try {
    const result = await query("SELECT * FROM Categories WHERE id = ?", [id]);
    if (result.error) {
      return { data: null, error: result.error };
    }
    const category = (result.data as any[])?.[0] || null;
    return { data: category as Category | null, error: null };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { data: null, error: "Failed to fetch category" };
  }
}

export async function createCategory(data: CategoryFormData) {
  try {
    await query("INSERT INTO Categories (name, description) VALUES (?, ?)", [
      data.name,
      data.description || null,
    ]);
    revalidatePath("/dashboard/categories");
    return { data: null, error: null };
  } catch (error) {
    console.error("Error creating category:", error);
    return { data: null, error: "Failed to create category" };
  }
}

export async function updateCategory(id: number, data: CategoryFormData) {
  try {
    await query(
      "UPDATE Categories SET name = ?, description = ? WHERE id = ?",
      [data.name, data.description || null, id]
    );
    revalidatePath("/dashboard/categories");
    return { data: null, error: null };
  } catch (error) {
    console.error("Error updating category:", error);
    return { data: null, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: number) {
  try {
    await query("DELETE FROM Categories WHERE id = ?", [id]);
    revalidatePath("/dashboard/categories");
    return { data: null, error: null };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { data: null, error: "Failed to delete category" };
  }
}

export async function searchCategories(searchQuery: string) {
  try {
    const result = await query(
      "SELECT * FROM Categories WHERE name LIKE ? ORDER BY name",
      [`%${searchQuery}%`]
    );
    if (result.error) {
      return { data: null, error: result.error };
    }
    return { data: result.data as Category[], error: null };
  } catch (error) {
    console.error("Error searching categories:", error);
    return { data: null, error: "Failed to search categories" };
  }
}
