import { getActiveUsersStats } from "./user-stats";
import { getArticleStats } from "./article-stats";
import { query } from "../db/db";

export interface DashboardStats {
  activeUsers: number;
  activeUsersTrend: number;
  totalArticles: number;
}

export async function getDashboardStats() {
  try {
    // Get active users stats
    const activeUsersResult = await getActiveUsersStats();

    // Get article stats
    const articleStatsResult = await getArticleStats();

    if (activeUsersResult.error) {
      return {
        data: {
          activeUsers: 0,
          activeUsersTrend: 0,
          totalArticles: 0
        },
        error: activeUsersResult.error
      };
    }

    // Return combined stats
    return {
      data: {
        activeUsers: activeUsersResult.data?.activeUsers || 0,
        activeUsersTrend: 0,
        totalArticles: articleStatsResult.data?.totalArticles || 0
      },
      error: null
    };
  } catch (error) {
    return {
      data: {
        activeUsers: 0,
        activeUsersTrend: 0,
        totalArticles: 0
      },
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
    };
  }
}

interface TrendingArticle {
  id: number;
  title: string;
  views: number;
  published_at: string;
}

export async function getTrendingArticles(): Promise<{
  data: TrendingArticle[] | null;
  error: string | null;
}> {
  try {
    const result = await query<TrendingArticle>(
      `SELECT id, title, views, created_at 
       FROM articles 
       WHERE is_trending = true 
       ORDER BY views DESC 
       LIMIT 3`
    );

    if (result.error) {
      throw new Error("Failed to fetch trending articles");
    }

    return {
      data: result.data || [],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch trending articles",
    };
  }
}

interface RecentActivity {
  id: number;
  description: string;
  created_at: string;
}

export async function getRecentActivity(): Promise<{
  data: RecentActivity[] | null;
  error: string | null;
}> {
  try {
    const result = await query<RecentActivity>(
      `SELECT 
        id,
        'comment' as type,
        CONCAT('New comment on Article ', article_id) as description,
        created_at
       FROM comments 
       ORDER BY created_at DESC 
       LIMIT 3`
    );

    if (result.error) {
      throw new Error("Failed to fetch recent activity");
    }

    return {
      data: result.data || [],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch recent activity",
    };
  }
} 