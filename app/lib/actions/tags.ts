"use server";

import { query } from "../db/query";
import { Tag, TagFormData } from "../definition";
import { resolveTableName } from "../db/tableNameResolver";

// Component Info
// Description: Server actions for tag CRUD operations and queries.
// Date updated: 2025-November-21
// Author: thangtruong

type TagCountRow = {
  total_count: number;
} & Record<string, unknown>;

interface GetTagsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

export async function getTags({
  page = 1,
  limit = 10,
  sortField = "created_at",
  sortDirection = "desc",
}: GetTagsParams = {}) {
  try {
    // Resolve table names with proper casing - with fallback to preferred names
    let tagsTable: string;
    let articleTagsTable: string;

    try {
      const resolvedTables = await Promise.all([
        resolveTableName("Tags"),
        resolveTableName("Article_Tags"),
      ]);
      tagsTable = resolvedTables[0] || "Tags";
      articleTagsTable = resolvedTables[1] || "Article_Tags";
    } catch (_resolveError) {
      // Fallback to preferred names if resolution fails
      tagsTable = "Tags";
      articleTagsTable = "Article_Tags";
    }

    const limitValue = Math.max(1, Number(limit) || 10);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;

    // First, get the total count
    const countResult = await query<TagCountRow>(
      `SELECT COUNT(*) as total_count FROM \`${tagsTable}\``
    );

    if (countResult.error || !countResult.data) {
      return {
        data: null,
        error: countResult.error ?? "Failed to fetch tags.",
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
      };
    }

    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as TagCountRow[])
      : [];
    const totalCount = countRows.length > 0 ? Number(countRows[0].total_count ?? 0) : 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limitValue));

    // Then get the paginated data
    const result = await query<
      Tag & {
        article_count?: number | null;
      }
    >(
      `
      SELECT 
        t.*,
        (SELECT COUNT(*) FROM \`${articleTagsTable}\` WHERE tag_id = t.id) as article_count
      FROM \`${tagsTable}\` t
      ORDER BY t.${sortField} ${sortDirection}
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `
    );

    if (result.error || !result.data) {
      return {
        data: null,
        error: result.error ?? "Failed to fetch tags.",
        totalCount,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages,
      };
    }

    const rows = Array.isArray(result.data)
      ? (result.data as Array<
          Tag & {
            article_count?: number | null;
          }
        >)
      : [];

    const tags = rows.map((tag) => ({
      ...tag,
      article_count: Number(tag.article_count ?? 0),
    }));

    const start = offsetValue + 1;
    const end = Math.min(offsetValue + limitValue, totalCount);

    return {
      data: tags,
      totalCount,
      start,
      end,
      currentPage: page,
      totalPages,
      error: null,
    };
  } catch (_error) {
    return {
      data: null,
      error: "Failed to fetch tags.",
      totalCount: 0,
      start: 0,
      end: 0,
      currentPage: page,
      totalPages: 0,
    };
  }
}

export async function getFilteredTags(
  categoryId?: string,
  subcategoryId?: string,
  page: number = 1,
  limit: number = 8
) {
  try {
    // Resolve table names with proper casing
    const [tagsTable, articleTagsTable] = await Promise.all([
      resolveTableName("Tags"),
      resolveTableName("Article_Tags"),
    ]);

    // Validate table names are resolved
    if (!tagsTable || !articleTagsTable) {
      return { data: [], totalCount: 0, error: "Failed to resolve table names." };
    }

    const conditions = [];
    const values = [];

    // Add category condition if it's provided
    if (categoryId) {
      conditions.push("t.category_id = ?");
      values.push(Number(categoryId));
    }

    // Add subcategory condition only if subcategory is provided
    if (subcategoryId) {
      conditions.push("t.sub_category_id = ?");
      values.push(Number(subcategoryId));
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // First, get the total count of all tags
    const countQuery = `
      SELECT COUNT(*) as total_count
      FROM \`${tagsTable}\` t
      ${whereClause}
    `;

    const countResult = await query<TagCountRow>(countQuery, values);
    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as TagCountRow[])
      : [];
    const totalCount = countRows.length > 0 ? Number(countRows[0].total_count ?? 0) : 0;

    // Then get the paginated data with article counts
    const result = await query<
      Tag & {
        article_count?: number | null;
      }
    >(
      `
      SELECT 
        t.*,
        COUNT(DISTINCT at.article_id) as article_count
      FROM \`${tagsTable}\` t
      LEFT JOIN \`${articleTagsTable}\` at ON t.id = at.tag_id
      ${whereClause}
      GROUP BY t.id
      ORDER BY article_count DESC, t.name ASC
      LIMIT ? OFFSET ?
    `,
      [...values, limit, offset]
    );

    if (!result.data || result.data.length === 0) {
      return { data: [], totalCount: 0, error: null };
    }

    const rows = Array.isArray(result.data)
      ? (result.data as Array<
          Tag & {
            article_count?: number | null;
          }
        >)
      : [];

    if (rows.length === 0) {
      return { data: [], totalCount: 0, error: null };
    }

    const tags = rows.map((tag) => ({
      ...tag,
      article_count: Number(tag.article_count ?? 0),
    }));

    return { data: tags, totalCount, error: null };
  } catch (_error) {
    return { data: [], totalCount: 0, error: "Failed to fetch tags" };
  }
}

export async function getTagById(id: number) {
  try {
    // Resolve table names with proper casing - with fallback to preferred names
    let tagsTable: string;
    let categoriesTable: string;
    let subcategoriesTable: string;

    try {
      const resolvedTables = await Promise.all([
        resolveTableName("Tags"),
        resolveTableName("Categories"),
        resolveTableName("SubCategories"),
      ]);
      tagsTable = resolvedTables[0] || "Tags";
      categoriesTable = resolvedTables[1] || "Categories";
      subcategoriesTable = resolvedTables[2] || "SubCategories";
    } catch (_resolveError) {
      // Fallback to preferred names if resolution fails
      tagsTable = "Tags";
      categoriesTable = "Categories";
      subcategoriesTable = "SubCategories";
    }

    const result = await query(
      `
      SELECT 
        t.id, 
        t.name, 
        t.description, 
        t.color, 
        t.category_id, 
        t.sub_category_id,
        DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(t.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at,
        c.name as category_name,
        sc.name as sub_category_name
      FROM \`${tagsTable}\` t
      LEFT JOIN \`${categoriesTable}\` c ON t.category_id = c.id
      LEFT JOIN \`${subcategoriesTable}\` sc ON t.sub_category_id = sc.id
      WHERE t.id = ?
    `,
      [id]
    );

    if (result.error) {
      return { data: null, error: result.error };
    }

    const tag = (result.data as any[])[0];
    if (!tag) {
      return { data: null, error: "Tag not found" };
    }

    return {
      data: {
        ...tag,
        created_at: new Date(tag.created_at),
        updated_at: new Date(tag.updated_at),
        category_id: tag.category_id || 0,
        sub_category_id: tag.sub_category_id || 0,
      },
      error: null,
    };
  } catch (_error) {
    return {
      data: null,
      error: "Failed to fetch tag",
    };
  }
}

export async function createTag(tagData: TagFormData) {
  try {
    // Resolve table name with proper casing
    const tagsTable = await resolveTableName("Tags");
    
    // Validate table name is resolved
    if (!tagsTable) {
      return { data: null, error: "Failed to resolve table name." };
    }

    const result = await query(
      `
      INSERT INTO \`${tagsTable}\` (name, description, color, category_id, sub_category_id)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        tagData.name,
        tagData.description,
        tagData.color,
        tagData.category_id || null,
        tagData.sub_category_id || null,
      ]
    );

    if (result.error) {
      return { data: null, error: result.error };
    }

    const insertId = (result.data as any).insertId;
    if (insertId) {
      const { data: tag, error } = await getTagById(insertId);
      if (error) {
        return { data: null, error };
      }
      if (tag) {
        return { data: tag, error: null };
      }
    }

    return { data: null, error: "Failed to create tag" };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create tag",
    };
  }
}

export async function updateTag(id: number, tagData: TagFormData) {
  try {
    // Resolve table name with proper casing
    const tagsTable = await resolveTableName("Tags");
    
    // Validate table name is resolved
    if (!tagsTable) {
      return { data: null, error: "Failed to resolve table name." };
    }

    await query(
      `
      UPDATE \`${tagsTable}\`
      SET name = ?, description = ?, color = ?, category_id = ?, sub_category_id = ?
      WHERE id = ?
    `,
      [
        tagData.name,
        tagData.description,
        tagData.color,
        tagData.category_id || null,
        tagData.sub_category_id || null,
        id,
      ]
    );

    const { data: tag } = await getTagById(id);
    return { data: tag, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update tag",
    };
  }
}

export async function deleteTag(id: number) {
  try {
    // Resolve table names with proper casing
    const [tagsTable, articleTagsTable] = await Promise.all([
      resolveTableName("Tags"),
      resolveTableName("Article_Tags"),
    ]);

    // Validate table names are resolved
    if (!tagsTable || !articleTagsTable) {
      return { data: null, error: "Failed to resolve table names." };
    }

    // First verify the tag exists
    const tagCheck = await query(`SELECT id FROM \`${tagsTable}\` WHERE id = ?`, [id]);

    if (tagCheck.error || !tagCheck.data || tagCheck.data.length === 0) {
      return {
        data: null,
        error: "Tag not found",
      };
    }

    // Check for associated articles through Article_Tags
    const articlesResult = await query(
      `SELECT COUNT(*) as count 
       FROM \`${articleTagsTable}\` 
       WHERE tag_id = ?`,
      [id]
    );

    if (articlesResult.error || !articlesResult.data) {
      return {
        data: null,
        error: "Failed to check related articles",
      };
    }

    const countRows = Array.isArray(articlesResult.data)
      ? (articlesResult.data as Array<{ count: number }>)
      : [];
    const articleCount = countRows.length > 0 ? Number(countRows[0].count ?? 0) : 0;
    if (articleCount > 0) {
      return {
        data: null,
        error: `Cannot delete tag because it has ${articleCount} article(s) associated with it. Please remove the tag from these articles first.`,
      };
    }

    // If no related records, proceed with deletion
    const deleteResult = await query(`DELETE FROM \`${tagsTable}\` WHERE id = ?`, [id]);

    if (deleteResult.error) {
      return {
        data: null,
        error: "Failed to delete tag",
      };
    }

    // Verify the tag was actually deleted
    const verifyDelete = await query(`SELECT id FROM \`${tagsTable}\` WHERE id = ?`, [id]);

    if (
      verifyDelete.error ||
      (verifyDelete.data && verifyDelete.data.length > 0)
    ) {
      return {
        data: null,
        error: "Failed to verify tag deletion",
      };
    }

    return { data: true, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete tag",
    };
  }
}

export async function searchTags(
  searchQuery: string,
  {
    page = 1,
    limit = 10,
    sortField = "created_at",
    sortDirection = "desc",
  }: GetTagsParams = {}
) {
  try {
    // Return all tags if search query is empty
    if (!searchQuery || !searchQuery.trim()) {
      return getTags({ page, limit, sortField, sortDirection });
    }

    // Resolve table names with proper casing
    const [tagsTable, articleTagsTable, categoriesTable, subcategoriesTable] = await Promise.all([
      resolveTableName("Tags"),
      resolveTableName("Article_Tags"),
      resolveTableName("Categories"),
      resolveTableName("SubCategories"),
    ]);

    // Validate table names are resolved
    if (!tagsTable || !articleTagsTable || !categoriesTable || !subcategoriesTable) {
      return {
        error: "Failed to resolve table names.",
        data: [],
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
      };
    }

    const limitValue = Math.max(1, Number(limit) || 10);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;
    const searchTerm = searchQuery.trim();

    // First, get the total count of tags matching the search
    const countResult = await query<{ count: number }>(
      `SELECT COUNT(*) as count 
      FROM \`${tagsTable}\` t
      WHERE t.name LIKE ? OR t.description LIKE ?`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );

    if (countResult.error || !countResult.data) {
      return {
        error: countResult.error ?? "Failed to fetch tags count.",
        data: [],
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
      };
    }

    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as Array<{ count: number }>)
      : [];
    const totalCount = countRows.length > 0 ? Number(countRows[0]?.count ?? 0) : 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limitValue));

    // Then get the paginated data with counts
    const result = await query<
      Tag & {
        articles_count?: number | null;
        categories_count?: number | null;
        subcategories_count?: number | null;
      }
    >(
      `SELECT 
        t.*,
        (SELECT COUNT(*) FROM \`${articleTagsTable}\` WHERE tag_id = t.id) as articles_count,
        (SELECT COUNT(*) FROM \`${categoriesTable}\` WHERE id = t.category_id) as categories_count,
        (SELECT COUNT(*) FROM \`${subcategoriesTable}\` WHERE id = t.sub_category_id) as subcategories_count
      FROM \`${tagsTable}\` t
      WHERE t.name LIKE ? OR t.description LIKE ?
      ORDER BY t.${sortField} ${sortDirection}
      LIMIT ${limitValue} OFFSET ${offsetValue}`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );

    if (result.error || !result.data) {
      return {
        error: result.error ?? "Failed to fetch tags data.",
        data: [],
        totalCount,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages,
      };
    }

    const rows = Array.isArray(result.data)
      ? (result.data as Array<
          Tag & {
            articles_count?: number | null;
            categories_count?: number | null;
            subcategories_count?: number | null;
          }
        >)
      : [];

    const tags = rows.map((tag) => ({
      ...tag,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
      articles_count: Number(tag.articles_count ?? 0),
      categories_count: Number(tag.categories_count ?? 0),
      subcategories_count: Number(tag.subcategories_count ?? 0),
    }));

    const start = offsetValue + 1;
    const end = Math.min(offsetValue + limitValue, totalCount);

    return {
      data: tags,
      totalCount,
      start,
      end,
      currentPage: page,
      totalPages,
      error: null,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to search tags",
      data: [],
      totalCount: 0,
      start: 0,
      end: 0,
      currentPage: page,
      totalPages: 0,
    };
  }
}

export async function getAllTags() {
  try {
    // Resolve table name with proper casing - with fallback to preferred name
    let tagsTable: string;

    try {
      tagsTable = await resolveTableName("Tags");
      tagsTable = tagsTable || "Tags";
    } catch (_resolveError) {
      // Fallback to preferred name if resolution fails
      tagsTable = "Tags";
    }

    const result = await query(
      `
      SELECT 
        t.id, 
        t.name, 
        t.description, 
        t.color,
        DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(t.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM \`${tagsTable}\` t
      ORDER BY t.name ASC
    `
    );

    if (result.error || !result.data) {
      throw new Error(result.error || "Failed to fetch data");
    }

    // Convert the dates to proper Date objects
    const tags = (result.data as any[]).map((tag) => ({
      ...tag,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
    })) as Tag[];

    return {
      data: tags,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch tags.",
    };
  }
}

export async function getTagsBySubcategory(subcategoryId: number) {
  try {
    // Resolve table names with proper casing - with fallback to preferred names
    let tagsTable: string;
    let articleTagsTable: string;

    try {
      const resolvedTables = await Promise.all([
        resolveTableName("Tags"),
        resolveTableName("Article_Tags"),
      ]);
      tagsTable = resolvedTables[0] || "Tags";
      articleTagsTable = resolvedTables[1] || "Article_Tags";
    } catch (_resolveError) {
      // Fallback to preferred names if resolution fails
      tagsTable = "Tags";
      articleTagsTable = "Article_Tags";
    }

    const result = await query(
      `
      SELECT 
        t.id, 
        t.name, 
        t.description, 
        t.color,
        DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(t.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at,
        (SELECT COUNT(*) FROM \`${articleTagsTable}\` WHERE tag_id = t.id) as article_count
      FROM \`${tagsTable}\` t
      WHERE t.sub_category_id = ?
      ORDER BY t.name ASC
    `,
      [subcategoryId]
    );

    if (result.error || !result.data) {
      throw new Error(result.error || "Failed to fetch data");
    }

    // Convert the dates to proper Date objects and ensure article_count is a number
    const tags = (result.data as any[]).map((tag) => ({
      ...tag,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
      article_count: Number(tag.article_count) || 0,
    })) as Tag[];

    return {
      data: tags,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch tags.",
    };
  }
}
