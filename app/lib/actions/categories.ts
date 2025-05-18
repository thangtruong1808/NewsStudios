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
      ? `WHERE c.name LIKE ? OR c.description LIKE ?`
      : "";
    const searchParams = search ? [`%${search}%`, `%${search}%`] : [];
    const orderBy = `ORDER BY c.${sortField} ${sortDirection}`;

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as count
      FROM Categories c
      ${searchCondition}
    `;
    const countResult = await query(countQuery, searchParams);
    if (countResult.error || !countResult.data) {
      throw new Error(countResult.error || "Failed to get count");
    }
    const totalItems = parseInt(countResult.data[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated data with subcategories and articles count
    const dataQuery = `
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM SubCategories sc WHERE sc.category_id = c.id) as subcategories_count,
        (SELECT COUNT(*) FROM Articles a WHERE a.category_id = c.id) as articles_count
      FROM Categories c
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
    // First check if there are any subcategories using this category
    const subCategoriesResult = await query(
      "SELECT COUNT(*) as count FROM SubCategories WHERE category_id = ?",
      [id]
    );

    if (subCategoriesResult.error) {
      throw new Error("Failed to check related subcategories");
    }

    const subCategoryCount = subCategoriesResult.data?.[0]?.count || 0;
    if (subCategoryCount > 0) {
      return {
        data: null,
        error:
          "Cannot delete category because it has associated subcategories. Please delete the subcategories first.",
      };
    }

    // Check for articles
    const articlesResult = await query(
      "SELECT COUNT(*) as count FROM Articles WHERE category_id = ?",
      [id]
    );

    if (articlesResult.error) {
      throw new Error("Failed to check related articles");
    }

    const articleCount = articlesResult.data?.[0]?.count || 0;
    if (articleCount > 0) {
      return {
        data: null,
        error:
          "Cannot delete category because it has associated articles. Please reassign or delete the articles first.",
      };
    }

    // If no related records, proceed with deletion
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
