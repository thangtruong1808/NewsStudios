"use server";

import { query } from "../db/db";

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
      console.log("No tags found");
      return { data: [], totalCount: 0 };
    }

    const tags = result.data.map((tag) => ({
      ...tag,
      article_count: Number(tag.article_count) || 0,
    }));

    return { data: tags, totalCount };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { error: "Failed to fetch tags" };
  }
}
