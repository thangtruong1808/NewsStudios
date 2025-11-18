"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/query";
import { CategoryFormData } from "../validations/categorySchema";
import { Category } from "../definition";
import { resolveTableName } from "../db/tableNameResolver";

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
    const limitValue = Math.max(1, Number(limit) || 10);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;
    const searchable = search.trim();
    const whereClause = searchable
      ? "WHERE c.name LIKE ? OR c.description LIKE ?"
      : "";
    const searchParams = searchable ? [`%${searchable}%`, `%${searchable}%`] : [];

    const orderBy = (() => {
      if (sortField === "subcategories_count") {
        return `ORDER BY (SELECT COUNT(*) FROM SubCategories sc WHERE sc.category_id = c.id) ${sortDirection}`;
      }
      if (sortField === "articles_count") {
        return `ORDER BY (SELECT COUNT(*) FROM Articles a WHERE a.category_id = c.id) ${sortDirection}`;
      }
      return `ORDER BY c.${sortField} ${sortDirection}`;
    })();

    const countResult = await query<{ total: number }>(
      `SELECT COUNT(*) as total FROM Categories c ${whereClause}`,
      searchParams
    );

    if (countResult.error || !countResult.data) {
      return {
        data: null,
        error: countResult.error ?? "Failed to fetch categories.",
        totalItems: 0,
        totalPages: 0,
      };
    }

    const totalItems = Number(countResult.data[0]?.total ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalItems / limitValue));

    const dataResult = await query<any>(
      `SELECT
         c.*,
         (SELECT COUNT(*) FROM SubCategories sc WHERE sc.category_id = c.id) as subcategories_count,
         (SELECT COUNT(*) FROM Articles a WHERE a.category_id = c.id) as articles_count
       FROM Categories c
       ${whereClause}
       ${orderBy}
       LIMIT ${limitValue} OFFSET ${offsetValue}`,
      searchParams
    );

    if (dataResult.error || !dataResult.data) {
      return {
        data: null,
        error: dataResult.error ?? "Failed to fetch categories.",
        totalItems,
        totalPages,
      };
    }

    const categories = (dataResult.data as any[]).map((category) => ({
      ...category,
      subcategories_count: Number(category.subcategories_count ?? 0),
      articles_count: Number(category.articles_count ?? 0),
      created_at: new Date(category.created_at),
      updated_at: new Date(category.updated_at),
    })) as Category[];

    return {
      data: categories,
      error: null,
      totalItems,
      totalPages,
    };
  } catch (_error) {
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
  } catch (_error) {
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
  } catch (_error) {
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
  } catch (_error) {
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
  } catch (_error) {
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
  } catch (_error) {
    return { data: null, error: "Failed to search categories" };
  }
}

export interface NavSubcategory {
  id: number;
  name: string;
}

export interface NavCategory {
  id: number;
  name: string;
  subcategories: NavSubcategory[];
}

export async function getNavCategories(): Promise<{
  data: NavCategory[] | null;
  error: string | null;
}> {
  try {
    // Resolve table names with proper casing
    const [categoriesTable, subcategoriesTable] = await Promise.all([
      resolveTableName("Categories"),
      resolveTableName("SubCategories"),
    ]);

    // Validate table names are resolved
    if (!categoriesTable || !subcategoriesTable) {
      return { data: null, error: "Failed to resolve table names." };
    }

    // Query categories and subcategories
    const result = await query<{
      category_id: number;
      category_name: string;
      subcategory_id: number | null;
      subcategory_name: string | null;
    }>(
      `SELECT
         c.id AS category_id,
         c.name AS category_name,
         s.id AS subcategory_id,
         s.name AS subcategory_name
       FROM \`${categoriesTable}\` c
       LEFT JOIN \`${subcategoriesTable}\` s ON s.category_id = c.id
       ORDER BY c.name ASC, s.name ASC`
    );

    if (result.error || !result.data) {
      return { data: null, error: result.error ?? "Failed to fetch navigation categories." };
    }

    // Transform query results into category structure
    const map = new Map<number, NavCategory>();

    for (const row of result.data) {
      if (!map.has(row.category_id)) {
        map.set(row.category_id, {
          id: row.category_id,
          name: row.category_name,
          subcategories: [],
        });
      }
      if (row.subcategory_id && row.subcategory_name) {
        map.get(row.category_id)!.subcategories.push({
          id: row.subcategory_id,
          name: row.subcategory_name,
        });
      }
    }

    const categories = Array.from(map.values());
    return { data: categories, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to fetch navigation categories." };
  }
}
