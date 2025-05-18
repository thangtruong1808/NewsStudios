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
  search = "",
  sortField = "name",
  sortDirection = "asc",
}: GetTagsParams = {}) {
  try {
    const offset = (page - 1) * limit;
    const searchCondition = search
      ? `WHERE t.name LIKE ? OR t.description LIKE ?`
      : "";
    const searchParams = search ? [`%${search}%`, `%${search}%`] : [];
    const orderBy = `ORDER BY t.${sortField} ${sortDirection}`;

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as count
      FROM Tags t
      ${searchCondition}
    `;
    const countResult = await query(countQuery, searchParams);
    if (countResult.error || !countResult.data) {
      throw new Error(countResult.error || "Failed to get count");
    }
    const totalItems = parseInt(countResult.data[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated data with counts
    const dataQuery = `
      SELECT 
        t.id, 
        t.name, 
        t.description, 
        t.color,
        DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(t.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at,
        COUNT(DISTINCT at.article_id) as articles_count,
        COUNT(DISTINCT a.category_id) as categories_count,
        COUNT(DISTINCT a.sub_category_id) as subcategories_count
      FROM Tags t
      LEFT JOIN Article_Tags at ON t.id = at.tag_id
      LEFT JOIN Articles a ON at.article_id = a.id
      ${searchCondition}
      GROUP BY t.id, t.name, t.description, t.color, t.created_at, t.updated_at
      ${orderBy}
      LIMIT ? 
      OFFSET ?
    `;

    const result = await query(dataQuery, [...searchParams, limit, offset]);

    if (result.error || !result.data) {
      throw new Error(result.error || "Failed to fetch data");
    }

    // Convert the dates to proper Date objects
    const tags = (result.data as any[]).map((tag) => ({
      ...tag,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
      articles_count: parseInt(tag.articles_count) || 0,
      categories_count: parseInt(tag.categories_count) || 0,
      subcategories_count: parseInt(tag.subcategories_count) || 0,
    })) as Tag[];

    return {
      data: tags,
      error: null,
      totalItems,
      totalPages,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      data: null,
      error: "Failed to fetch tags.",
      totalItems: 0,
      totalPages: 0,
    };
  }
}

export async function getTagById(id: number) {
  try {
    const result = await query(
      `
      SELECT id, name, description, color, 
             DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
             DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM Tags
      WHERE id = ?
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
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching tag:", error);
    return { data: null, error: "Failed to fetch tag" };
  }
}

export async function createTag(tagData: TagFormData) {
  try {
    const result = await query(
      `
      INSERT INTO Tags (name, description, color)
      VALUES (?, ?, ?)
    `,
      [tagData.name, tagData.description, tagData.color]
    );

    if (result.error) {
      console.error("Error creating tag:", result.error);
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
    console.error("Error creating tag:", error);
    return { data: null, error: "Failed to create tag" };
  }
}

export async function updateTag(id: number, tagData: TagFormData) {
  try {
    await query(
      `
      UPDATE Tags
      SET name = ?, description = ?, color = ?
      WHERE id = ?
    `,
      [tagData.name, tagData.description, tagData.color, id]
    );

    const { data: tag } = await getTagById(id);
    return { data: tag, error: null };
  } catch (error) {
    console.error("Error updating tag:", error);
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
      console.error("Error checking articles:", articlesResult.error);
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
      console.error("Error deleting tag:", deleteResult.error);
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
      console.error("Error verifying deletion:", verifyDelete.error);
      return {
        data: null,
        error: "Failed to verify tag deletion",
      };
    }

    return { data: true, error: null };
  } catch (error) {
    console.error("Error in deleteTag:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete tag",
    };
  }
}

export async function searchTags(searchQuery: string) {
  try {
    if (!searchQuery.trim()) {
      return getTags();
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
        COUNT(DISTINCT at.article_id) as articles_count,
        COUNT(DISTINCT a.category_id) as categories_count,
        COUNT(DISTINCT a.sub_category_id) as subcategories_count
      FROM Tags t
      LEFT JOIN Article_Tags at ON t.id = at.tag_id
      LEFT JOIN Articles a ON at.article_id = a.id
      WHERE t.name LIKE ? OR t.description LIKE ?
      GROUP BY t.id, t.name, t.description, t.color, t.created_at, t.updated_at
      ORDER BY t.name ASC
    `,
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );

    if (result.error) {
      console.error("Error searching tags:", result.error);
      return { data: null, error: result.error, totalItems: 0 };
    }

    // Convert the dates to proper Date objects and parse counts
    const tags = (result.data as any[]).map((tag) => ({
      ...tag,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
      articles_count: parseInt(tag.articles_count) || 0,
      categories_count: parseInt(tag.categories_count) || 0,
      subcategories_count: parseInt(tag.subcategories_count) || 0,
    })) as Tag[];

    return { data: tags, error: null, totalItems: tags.length };
  } catch (error) {
    console.error("Error searching tags:", error);
    return { data: null, error: "Failed to search tags", totalItems: 0 };
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
    console.error("Database Error:", error);
    return {
      data: null,
      error: "Failed to fetch tags.",
    };
  }
}
