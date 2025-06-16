"use server";

import { query } from "../db/db";
import pool from "../db/db";
import { Tag, TagFormData } from "../definition";

interface QueryResult {
  data?: TagRow[];
  error?: string;
  insertId?: number;
}

interface TagRow {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

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
    const offset = (page - 1) * limit;

    // First, get the total count
    const countResult = await query(`SELECT COUNT(*) as total_count FROM Tags`);
    const totalCount = countResult.data?.[0]?.total_count || 0;

    // Then get the paginated data
    const result = await query(
      `
      SELECT 
        t.*,
        (SELECT COUNT(*) FROM Article_Tags WHERE tag_id = t.id) as article_count
      FROM Tags t
      ORDER BY t.${sortField} ${sortDirection}
      LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );

    if (!result.data || result.data.length === 0) {
      return {
        data: [],
        totalCount: 0,
        start: 0,
        end: 0,
        currentPage: page,
        totalPages: 0,
      };
    }

    const tags = result.data.map((tag) => ({
      ...tag,
      article_count: Number(tag.article_count) || 0,
    }));

    const start = offset + 1;
    const end = Math.min(offset + limit, totalCount);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: tags,
      totalCount,
      start,
      end,
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    return { error: "Failed to fetch tags" };
  }
}

export async function getFilteredTags(
  categoryId?: string,
  subcategoryId?: string,
  page: number = 1,
  limit: number = 8
) {
  try {
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
      FROM Tags t
      ${whereClause}
    `;

    const countResult = await query(countQuery, values);
    const totalCount = countResult.data?.[0]?.total_count || 0;

    // Then get the paginated data with article counts
    const result = await query(
      `
      SELECT 
        t.*,
        COUNT(DISTINCT at.article_id) as article_count
      FROM Tags t
      LEFT JOIN Article_Tags at ON t.id = at.tag_id
      ${whereClause}
      GROUP BY t.id
      ORDER BY article_count DESC, t.name ASC
      LIMIT ? OFFSET ?
    `,
      [...values, limit, offset]
    );

    if (!result.data || result.data.length === 0) {
      return { data: [], totalCount: 0 };
    }

    const tags = result.data.map((tag) => ({
      ...tag,
      article_count: Number(tag.article_count) || 0,
    }));

    return { data: tags, totalCount };
  } catch (error) {
    return { error: "Failed to fetch tags" };
  }
}

export async function getTagById(id: number) {
  try {
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
      FROM Tags t
      LEFT JOIN Categories c ON t.category_id = c.id
      LEFT JOIN SubCategories sc ON t.sub_category_id = sc.id
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
  } catch (error) {
    return { data: null, error: "Failed to fetch tag" };
  }
}

export async function createTag(tagData: TagFormData) {
  try {
    const result = await query(
      `
      INSERT INTO Tags (name, description, color, category_id, sub_category_id)
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
    return { data: null, error: "Failed to create tag" };
  }
}

export async function updateTag(id: number, tagData: TagFormData) {
  try {
    await query(
      `
      UPDATE Tags
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
    return { data: null, error: "Failed to update Tag" };
  }
}

export async function deleteTag(id: number) {
  try {
    // First verify the tag exists
    const tagCheck = await query("SELECT id FROM Tags WHERE id = ?", [id]);

    if (tagCheck.error || !tagCheck.data || tagCheck.data.length === 0) {
      return {
        data: null,
        error: "Tag not found",
      };
    }

    // Check for associated articles through Article_Tags
    const articlesResult = await query(
      `SELECT COUNT(*) as count 
       FROM Article_Tags 
       WHERE tag_id = ?`,
      [id]
    );

    if (articlesResult.error || !articlesResult.data) {
      return {
        data: null,
        error: "Failed to check related articles",
      };
    }

    const articleCount = parseInt(articlesResult.data[0].count) || 0;
    if (articleCount > 0) {
      return {
        data: null,
        error: `Cannot delete tag because it has ${articleCount} article(s) associated with it. Please remove the tag from these articles first.`,
      };
    }

    // If no related records, proceed with deletion
    const deleteResult = await query("DELETE FROM Tags WHERE id = ?", [id]);

    if (deleteResult.error) {
      return {
        data: null,
        error: "Failed to delete tag",
      };
    }

    // Verify the tag was actually deleted
    const verifyDelete = await query("SELECT id FROM Tags WHERE id = ?", [id]);

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
    if (!searchQuery) {
      return getTags({ page, limit, sortField, sortDirection });
    }

    const offset = (page - 1) * limit;

    // First, get the total count of tags matching the search
    const countResult = await query<{ count: number }>(
      `SELECT COUNT(*) as count 
      FROM Tags t
      WHERE t.name LIKE ? OR t.description LIKE ?`,
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );
    const totalCount = countResult.data?.[0]?.count || 0;

    // Then get the paginated data with counts
    const result = await query<Tag>(
      `SELECT 
        t.*,
        (SELECT COUNT(*) FROM Article_Tags WHERE tag_id = t.id) as articles_count,
        (SELECT COUNT(*) FROM Categories WHERE id = t.category_id) as categories_count,
        (SELECT COUNT(*) FROM SubCategories WHERE id = t.sub_category_id) as subcategories_count
      FROM Tags t
      WHERE t.name LIKE ? OR t.description LIKE ?
      ORDER BY t.${sortField} ${sortDirection}
      LIMIT ? OFFSET ?`,
      [`%${searchQuery}%`, `%${searchQuery}%`, limit, offset]
    );

    if (!result.data) {
      throw new Error("Failed to fetch tags data");
    }

    const start = offset + 1;
    const end = Math.min(offset + limit, totalCount);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: result.data.map((tag) => ({
        ...tag,
        created_at: new Date(tag.created_at),
        updated_at: new Date(tag.updated_at),
        articles_count: Number(tag.articles_count) || 0,
        categories_count: Number(tag.categories_count) || 0,
        subcategories_count: Number(tag.subcategories_count) || 0,
      })),
      totalCount,
      start,
      end,
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    return {
      error: "Failed to search tags",
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
    const result = await query(
      `
      SELECT 
        t.id, 
        t.name, 
        t.description, 
        t.color,
        DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(t.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM Tags t
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
      error: "Failed to fetch tags.",
    };
  }
}

export async function getTagsBySubcategory(subcategoryId: number) {
  try {
    const result = await query(
      `
      SELECT 
        t.id, 
        t.name, 
        t.description, 
        t.color,
        DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(t.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM Tags t
      WHERE t.sub_category_id = ?
      ORDER BY t.name ASC
    `,
      [subcategoryId]
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
      error: "Failed to fetch tags.",
    };
  }
}
