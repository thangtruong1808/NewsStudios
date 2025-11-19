"use server";

// Component Info
// Description: Server action fetching tags with category and subcategory filters.
// Date created: 2025-11-18
// Author: thangtruong

import { query } from "../db/query";
import { resolveTableName } from "../db/tableNameResolver";

type FrontendTagRow = {
  total_count?: number;
  article_count?: number | null;
} & Record<string, unknown>;

export async function getFilteredTags(
  categoryId?: string,
  subcategoryId?: string,
  page: number = 1,
  limit: number = 8
) {
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

    const conditions = [];
    const values: Array<number> = [];

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
    const limitValue = Math.max(1, Number(limit) || 8);
    const offsetValue = Math.max(0, (Number(page) || 1) - 1) * limitValue;

    // First, get the total count of all tags
    const countQuery = `
      SELECT COUNT(*) as total_count
      FROM \`${tagsTable}\` t
      ${whereClause}
    `;

    const countResult = await query<FrontendTagRow>(countQuery, values);
    const countRows = Array.isArray(countResult.data)
      ? (countResult.data as FrontendTagRow[])
      : [];
    const totalCount = countRows.length > 0 ? Number(countRows[0].total_count ?? 0) : 0;

    // Then get the paginated data with article counts
    const result = await query<FrontendTagRow>(
      `
      SELECT 
        t.*,
        COUNT(DISTINCT at.article_id) as article_count
      FROM \`${tagsTable}\` t
      LEFT JOIN \`${articleTagsTable}\` at ON t.id = at.tag_id
      ${whereClause}
      GROUP BY t.id
      ORDER BY article_count DESC, t.name ASC
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `,
      values
    );

    const rows = Array.isArray(result.data)
      ? (result.data as FrontendTagRow[])
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
