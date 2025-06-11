"use server";

import { query } from "../db/db";
import { SubCategory } from "../definition";
import { revalidatePath } from "next/cache";

interface SubcategoryFormData {
  name: string;
  description?: string | null;
  category_id: number;
}

interface GetSubcategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  categoryId?: number;
}

interface GetSubcategoriesResult {
  data: SubCategory[] | null;
  error: string | null;
  total: number;
}

export async function getSubcategories({
  page = 1,
  limit = 10,
  search = "",
  sortField = "created_at",
  sortDirection = "desc",
  categoryId,
}: GetSubcategoriesParams = {}): Promise<GetSubcategoriesResult> {
  try {
    const offset = (page - 1) * limit;
    let conditions = [];
    let params = [];

    // Add search condition if search term exists
    if (search) {
      conditions.push(
        `(s.name LIKE ? OR s.description LIKE ? OR c.name LIKE ?)`
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Add category filter if categoryId exists
    if (categoryId) {
      conditions.push(`s.category_id = ?`);
      params.push(categoryId);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Handle special sorting for computed fields
    let orderBy;
    if (sortField === "articles_count") {
      orderBy = `ORDER BY (SELECT COUNT(*) FROM Articles a WHERE a.sub_category_id = s.id) ${sortDirection}`;
    } else if (sortField === "category_name") {
      orderBy = `ORDER BY c.name ${sortDirection}`;
    } else {
      orderBy = `ORDER BY s.${sortField} ${sortDirection}`;
    }

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as count
      FROM SubCategories s
      LEFT JOIN Categories c ON s.category_id = c.id
      ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    if (countResult.error || !countResult.data) {
      throw new Error(countResult.error || "Failed to get count");
    }
    const total = parseInt(countResult.data[0].count);

    // Get paginated data with articles count
    const dataQuery = `
      SELECT 
        s.*, 
        c.name as category_name,
        (SELECT COUNT(*) FROM Articles a WHERE a.sub_category_id = s.id) as articles_count
      FROM SubCategories s
      LEFT JOIN Categories c ON s.category_id = c.id
      ${whereClause}
      ${orderBy}
      LIMIT ? 
      OFFSET ?
    `;

    const result = await query(dataQuery, [...params, limit, offset]);

    if (result.error || !result.data) {
      throw new Error(result.error || "Failed to fetch data");
    }

    // Convert the counts to numbers and ensure proper data types
    const subcategories = (result.data as any[]).map((subcategory) => ({
      ...subcategory,
      articles_count: parseInt(subcategory.articles_count) || 0,
      created_at: new Date(subcategory.created_at),
      updated_at: new Date(subcategory.updated_at),
    })) as SubCategory[];

    return {
      data: subcategories,
      error: null,
      total,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      data: null,
      error: "Failed to fetch subcategories.",
      total: 0,
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
  limit = 10,
  sortField = "created_at",
  sortDirection = "desc"
) {
  try {
    const offset = (page - 1) * limit;
    const searchCondition = `WHERE s.name LIKE ? OR s.description LIKE ? OR c.name LIKE ?`;
    const searchParams = [
      `%${searchQuery}%`,
      `%${searchQuery}%`,
      `%${searchQuery}%`,
    ];

    // Handle special sorting for computed fields
    let orderBy;
    if (sortField === "articles_count") {
      orderBy = `ORDER BY (SELECT COUNT(*) FROM Articles a WHERE a.sub_category_id = s.id) ${sortDirection}`;
    } else if (sortField === "category_name") {
      orderBy = `ORDER BY c.name ${sortDirection}`;
    } else {
      orderBy = `ORDER BY s.${sortField} ${sortDirection}`;
    }

    // Get total count for search results
    const countQuery = `
      SELECT COUNT(*) as count
      FROM SubCategories s
      LEFT JOIN Categories c ON s.category_id = c.id
      ${searchCondition}
    `;
    const countResult = await query(countQuery, searchParams);
    if (countResult.error || !countResult.data) {
      throw new Error(countResult.error || "Failed to get count");
    }
    const total = parseInt(countResult.data[0].count);

    // Get paginated search results
    const dataQuery = `
      SELECT 
        s.*, 
        c.name as category_name,
        (SELECT COUNT(*) FROM Articles a WHERE a.sub_category_id = s.id) as articles_count
      FROM SubCategories s
      LEFT JOIN Categories c ON s.category_id = c.id
      ${searchCondition}
      ${orderBy}
      LIMIT ? 
      OFFSET ?
    `;

    const result = await query(dataQuery, [...searchParams, limit, offset]);

    if (result.error || !result.data) {
      throw new Error(result.error || "Failed to fetch data");
    }

    // Convert the counts to numbers and ensure proper data types
    const subcategories = (result.data as any[]).map((subcategory) => ({
      ...subcategory,
      articles_count: parseInt(subcategory.articles_count) || 0,
      created_at: new Date(subcategory.created_at),
      updated_at: new Date(subcategory.updated_at),
    })) as SubCategory[];

    return {
      data: subcategories,
      error: null,
      total,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      data: null,
      error: "Failed to search subcategories.",
      total: 0,
    };
  }
}
