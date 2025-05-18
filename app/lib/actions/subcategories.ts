"use server";

import { query } from "../db/db";
import { SubCategory } from "../definition";
import { revalidatePath } from "next/cache";

interface SubcategoryFormData {
  name: string;
  description?: string | null;
  category_id: number;
}

export async function getSubcategories(page = 1, limit = 10) {
  try {
    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total 
      FROM SubCategories
    `);

    // Get paginated data with articles count
    const result = await query(
      `
      SELECT 
        s.*, 
        c.name as category_name,
        (SELECT COUNT(*) FROM Articles a WHERE a.sub_category_id = s.id) as articles_count
      FROM SubCategories s
      LEFT JOIN Categories c ON s.category_id = c.id
      ORDER BY c.name ASC, s.name ASC
      LIMIT ? OFFSET ?
    `,
      [limit, (page - 1) * limit]
    );

    if (
      result.error ||
      !result.data ||
      countResult.error ||
      !countResult.data
    ) {
      return {
        data: null,
        error: result.error || countResult.error || "No data found",
      };
    }

    const total = (countResult.data[0] as { total: number }).total;
    return {
      data: result.data as SubCategory[],
      total,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return {
      data: null,
      total: 0,
      error: "Failed to fetch subcategories",
    };
  }
}

export async function getSubcategoryById(id: number) {
  try {
    const result = await query("SELECT * FROM SubCategories WHERE id = ?", [
      id,
    ]);
    if (result.error) {
      return { data: null, error: result.error };
    }
    const subcategory = (result.data as any[])?.[0] || null;
    return { data: subcategory as SubCategory | null, error: null };
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    return { data: null, error: "Failed to fetch subcategory" };
  }
}

export async function createSubcategory(data: SubcategoryFormData) {
  try {
    const result = await query(
      `INSERT INTO SubCategories (name, description, category_id) 
       VALUES (?, ?, ?)`,
      [data.name, data.description || null, data.category_id]
    );

    if (result.error) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/subcategories");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return {
      success: false,
      error: "Failed to create subcategory",
    };
  }
}

export async function updateSubcategory(
  id: number,
  data: Partial<Omit<SubCategory, "id" | "created_at" | "updated_at">>
) {
  try {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(data), id];

    const result = await query(
      `UPDATE SubCategories SET ${fields} WHERE id = ?`,
      values
    );

    if (result.error) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/subcategories");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return { success: false, error: "Failed to update subcategory" };
  }
}

export async function deleteSubcategory(id: number) {
  try {
    // First check if there are any articles using this subcategory
    const articlesResult = await query(
      `SELECT COUNT(*) as count FROM Articles WHERE sub_category_id = ?`,
      [id]
    );

    if (articlesResult.error || !articlesResult.data) {
      return { success: false, error: "Failed to check for articles" };
    }

    const articleCount = (articlesResult.data[0] as { count: number }).count;
    if (articleCount > 0) {
      return {
        success: false,
        error: `Cannot delete subcategory. It has ${articleCount} article(s) associated with it. Please reassign or delete these articles first.`,
      };
    }

    // If no articles are using this subcategory, proceed with deletion
    const result = await query("DELETE FROM SubCategories WHERE id = ?", [id]);

    if (result.error) {
      return { success: false, error: "Failed to delete subcategory" };
    }

    revalidatePath("/dashboard/subcategories");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return { success: false, error: "Failed to delete subcategory" };
  }
}

export async function searchSubcategories(
  searchQuery: string,
  page = 1,
  limit = 10
) {
  try {
    // Get total count for search results
    const countResult = await query(
      `SELECT COUNT(*) as total 
       FROM SubCategories s
       LEFT JOIN Categories c ON s.category_id = c.id
       WHERE s.name LIKE ? OR s.description LIKE ? OR c.name LIKE ?`,
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
    );

    // Get paginated search results
    const result = await query(
      `SELECT s.*, c.name as category_name 
       FROM SubCategories s
       LEFT JOIN Categories c ON s.category_id = c.id
       WHERE s.name LIKE ? OR s.description LIKE ? OR c.name LIKE ?
       ORDER BY c.name ASC, s.name ASC
       LIMIT ? OFFSET ?`,
      [
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        limit,
        (page - 1) * limit,
      ]
    );

    if (
      result.error ||
      !result.data ||
      countResult.error ||
      !countResult.data
    ) {
      return {
        data: null,
        error: result.error || countResult.error || "No data found",
      };
    }

    const total = (countResult.data[0] as { total: number }).total;
    return {
      data: result.data as SubCategory[],
      total,
      error: null,
    };
  } catch (error) {
    console.error("Error searching subcategories:", error);
    return {
      data: null,
      total: 0,
      error: "Failed to search subcategories",
    };
  }
}
