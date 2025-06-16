import { query } from "../db/db";

export async function getArticleStats() {
  try {
    const result = await query<{ total_articles: number }>(
      `SELECT COUNT(*) as total_articles FROM Articles`
    );

    if (result.error) {
      console.error('Error fetching article stats:', result.error);
      return {
        data: { totalArticles: 0 },
        error: result.error
      };
    }

    return {
      data: { totalArticles: result.data?.[0]?.total_articles || 0 },
      error: null
    };
  } catch (error) {
    console.error('Error in getArticleStats:', error);
    return {
      data: { totalArticles: 0 },
      error: error instanceof Error ? error.message : 'Failed to fetch article stats'
    };
  }
} 