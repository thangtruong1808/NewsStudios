"use server";

import { query } from "../db/query";
import { SubCategory } from "../definition";
import { revalidatePath } from "next/cache";
import { resolveTableName } from "../db/tableNameResolver";

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
    // Resolve table names with proper casing - with fallback to preferred names
    let subcategoriesTable: string;
    let categoriesTable: string;
    let articlesTable: string;

    try {
      const resolvedTables = await Promise.all([
        resolveTableName("SubCategories"),
        resolveTableName("Categories"),
        resolveTableName("Articles"),
      ]);
      subcategoriesTable = resolvedTables[0] || "SubCategories";
      categoriesTable = resolvedTables[1] || "Categories";
      articlesTable = resolvedTables[2] || "Articles";
    } catch (_resolveError) {
      // Fallback to preferred names if resolution fails
      subcategoriesTable = "SubCategories";
      categoriesTable = "Categories";
      articlesTable = "Articles";
    }

    const limitValue = Math.max(1, Number(limit) || 10);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;
    const searchable = search.trim();
    const conditions: string[] = [];
    const params: Array<string | number> = [];

    if (searchable) {
      conditions.push(`(s.name LIKE ? OR s.description LIKE ? OR c.name LIKE ?)`);
      params.push(`%${searchable}%`, `%${searchable}%`, `%${searchable}%`);
    }

    if (categoryId) {
      conditions.push(`s.category_id = ?`);
      params.push(categoryId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const orderBy = (() => {
      if (sortField === "articles_count") {
        return `ORDER BY (SELECT COUNT(*) FROM \`${articlesTable}\` a WHERE a.sub_category_id = s.id) ${sortDirection}`;
      }
      if (sortField === "category_name") {
        return `ORDER BY c.name ${sortDirection}`;
      }
      return `ORDER BY s.${sortField} ${sortDirection}`;
    })();

    const countResult = await query<{ count: number }>(
      `SELECT COUNT(*) as count
       FROM \`${subcategoriesTable}\` s
       LEFT JOIN \`${categoriesTable}\` c ON s.category_id = c.id
       ${whereClause}`,
      params
    );

    if (countResult.error || !countResult.data) {
      return {
        data: null,
        error: countResult.error ?? "Failed to fetch subcategories.",
        total: 0,
      };
    }

    const total = Number(countResult.data[0]?.count ?? 0);

    const dataResult = await query<any>(
      `SELECT
         s.*,
         c.name as category_name,
         (SELECT COUNT(*) FROM \`${articlesTable}\` a WHERE a.sub_category_id = s.id) as articles_count
       FROM \`${subcategoriesTable}\` s
       LEFT JOIN \`${categoriesTable}\` c ON s.category_id = c.id
       ${whereClause}
       ${orderBy}
       LIMIT ${limitValue} OFFSET ${offsetValue}`,
      params
    );

    if (dataResult.error || !dataResult.data) {
      return {
        data: null,
        error: dataResult.error ?? "Failed to fetch subcategories.",
        total,
      };
    }

    const subcategories = (dataResult.data as any[]).map((subcategory) => ({
      ...subcategory,
      articles_count: Number(subcategory.articles_count ?? 0),
      created_at: new Date(subcategory.created_at),
      updated_at: new Date(subcategory.updated_at),
    })) as SubCategory[];

    return {
      data: subcategories,
      error: null,
      total,
    };
  } catch (_error) {
    return {
      data: null,
      error: "Failed to fetch subcategories.",
      total: 0,
    };
  }
}

export async function getSubcategoryById(id: number) {
  try {
    // Resolve table name with proper casing - with fallback to preferred name
    let subcategoriesTable: string;

    try {
      subcategoriesTable = await resolveTableName("SubCategories");
      subcategoriesTable = subcategoriesTable || "SubCategories";
    } catch (_resolveError) {
      // Fallback to preferred name if resolution fails
      subcategoriesTable = "SubCategories";
    }

    const result = await query(`SELECT * FROM \`${subcategoriesTable}\` WHERE id = ?`, [
      id,
    ]);
    if (result.error) {
      return { data: null, error: result.error };
    }
    const subcategory = (result.data as any[])?.[0] || null;
    return { data: subcategory as SubCategory | null, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to fetch subcategory" };
  }
}

export async function createSubcategory(data: SubcategoryFormData) {
  try {
    // Resolve table name with proper casing
    const subcategoriesTable = await resolveTableName("SubCategories");
    
    // Validate table name is resolved
    if (!subcategoriesTable) {
      return { success: false, error: "Failed to resolve table name." };
    }

    const result = await query(
      `INSERT INTO \`${subcategoriesTable}\` (name, description, category_id) VALUES (?, ?, ?)`,
      [data.name, data.description || null, data.category_id]
    );

    if (result.error) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/subcategories");
    return { success: true, error: null };
  } catch (_error) {
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
    // Resolve table name with proper casing
    const subcategoriesTable = await resolveTableName("SubCategories");
    
    // Validate table name is resolved
    if (!subcategoriesTable) {
      return { success: false, error: "Failed to resolve table name." };
    }

    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(data), id];

    const result = await query(
      `UPDATE \`${subcategoriesTable}\` SET ${fields} WHERE id = ?`,
      values
    );

    if (result.error) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/subcategories");
    return { success: true, error: null };
  } catch (_error) {
    return { success: false, error: "Failed to update subcategory" };
  }
}

export async function deleteSubcategory(id: number) {
  try {
    // Resolve table names with proper casing
    const [subcategoriesTable, articlesTable] = await Promise.all([
      resolveTableName("SubCategories"),
      resolveTableName("Articles"),
    ]);

    // Validate table names are resolved
    if (!subcategoriesTable || !articlesTable) {
      return { success: false, error: "Failed to resolve table names." };
    }

    // First check if there are any articles using this subcategory
    const articlesResult = await query(
      `SELECT COUNT(*) as count FROM \`${articlesTable}\` WHERE sub_category_id = ?`,
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
    const result = await query(`DELETE FROM \`${subcategoriesTable}\` WHERE id = ?`, [id]);

    if (result.error) {
      return { success: false, error: "Failed to delete subcategory" };
    }

    revalidatePath("/dashboard/subcategories");
    return { success: true, error: null };
  } catch (_error) {
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
    // Resolve table names with proper casing
    const [subcategoriesTable, categoriesTable, articlesTable] = await Promise.all([
      resolveTableName("SubCategories"),
      resolveTableName("Categories"),
      resolveTableName("Articles"),
    ]);

    // Validate table names are resolved
    if (!subcategoriesTable || !categoriesTable || !articlesTable) {
      return {
        data: null,
        error: "Failed to resolve table names.",
        total: 0,
      };
    }

    const limitValue = Math.max(1, Number(limit) || 10);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;
    const searchCondition = `WHERE s.name LIKE ? OR s.description LIKE ? OR c.name LIKE ?`;
    const searchParams = [
      `%${searchQuery}%`,
      `%${searchQuery}%`,
      `%${searchQuery}%`,
    ];

    const orderBy = (() => {
      if (sortField === "articles_count") {
        return `ORDER BY (SELECT COUNT(*) FROM \`${articlesTable}\` a WHERE a.sub_category_id = s.id) ${sortDirection}`;
      }
      if (sortField === "category_name") {
        return `ORDER BY c.name ${sortDirection}`;
      }
      return `ORDER BY s.${sortField} ${sortDirection}`;
    })();

    const countResult = await query<{ count: number }>(
      `SELECT COUNT(*) as count
       FROM \`${subcategoriesTable}\` s
       LEFT JOIN \`${categoriesTable}\` c ON s.category_id = c.id
       ${searchCondition}`,
      searchParams
    );
    if (countResult.error || !countResult.data) {
      throw new Error(countResult.error || "Failed to get count");
    }
    const total = Number(countResult.data[0]?.count ?? 0);

    const dataQuery = `
      SELECT 
        s.*, 
        c.name as category_name,
        (SELECT COUNT(*) FROM \`${articlesTable}\` a WHERE a.sub_category_id = s.id) as articles_count
      FROM \`${subcategoriesTable}\` s
      LEFT JOIN \`${categoriesTable}\` c ON s.category_id = c.id
      ${searchCondition}
      ${orderBy}
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `;

    const result = await query(dataQuery, searchParams);

    if (result.error || !result.data) {
      throw new Error(result.error || "Failed to fetch data");
    }

    const subcategories = (result.data as any[]).map((subcategory) => ({
      ...subcategory,
      articles_count: Number(subcategory.articles_count ?? 0),
      created_at: new Date(subcategory.created_at),
      updated_at: new Date(subcategory.updated_at),
    })) as SubCategory[];

    return {
      data: subcategories,
      error: null,
      total,
    };
  } catch (_error) {
    return {
      data: null,
      error: "Failed to search subcategories.",
      total: 0,
    };
  }
}
