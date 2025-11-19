// Component Info
// Description: Server action for fetching article statistics from database.
// Date created: 2025-01-27
// Author: thangtruong

import { query } from "../db/db";
import { resolveTableName } from "../db/tableNameResolver";

export async function getArticleStats() {
  try {
    // Resolve table name with proper casing - with fallback to preferred name
    let articlesTable: string;

    try {
      articlesTable = await resolveTableName("Articles");
      articlesTable = articlesTable || "Articles";
    } catch (_resolveError) {
      // Fallback to preferred name if resolution fails
      articlesTable = "Articles";
    }

    const result = await query<{ total_articles: number }>(
      `SELECT COUNT(*) as total_articles FROM \`${articlesTable}\``
    );

    if (result.error) {
      return {
        data: { totalArticles: 0 },
        error: result.error,
      };
    }

    return {
      data: { totalArticles: result.data?.[0]?.total_articles || 0 },
      error: null,
    };
  } catch (error) {
    return {
      data: { totalArticles: 0 },
      error: error instanceof Error ? error.message : "Failed to fetch article stats",
    };
  }
} 