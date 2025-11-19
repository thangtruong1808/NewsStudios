// Component Info
// Description: Server actions for fetching dashboard statistics and data from database.
// Date created: 2025-01-27
// Author: thangtruong

import { getActiveUsersStats } from "./user-stats";
import { getArticleStats } from "./article-stats";
import { query } from "../db/db";
import { resolveTableName } from "../db/tableNameResolver";

export interface DashboardStats {
  activeUsers: number;
  inactiveUsers: number;
  activeUsersTrend: number;
  totalArticles: number;
  totalLikes: number;
  totalComments: number;
  pageViewsLast30Days: number;
  newUsersLast30Days: number;
  trendingTopics: number;
  mostLikedArticle?: {
    id: number;
    title: string;
    likes_count: number;
  };
}

export async function getDashboardStats() {
  try {
    // Resolve table names
    const [articlesTable, viewsTable, commentsTable, usersTable, likesTable] = await Promise.all([
      resolveTableName("Articles"),
      resolveTableName("Views"),
      resolveTableName("Comments"),
      resolveTableName("Users"),
      resolveTableName("Likes"),
    ]);

    if (!articlesTable || !viewsTable || !commentsTable || !usersTable || !likesTable) {
      return {
        data: {
          activeUsers: 0,
          inactiveUsers: 0,
          activeUsersTrend: 0,
          totalArticles: 0,
          totalLikes: 0,
          totalComments: 0,
          pageViewsLast30Days: 0,
          newUsersLast30Days: 0,
          trendingTopics: 0,
          mostLikedArticle: undefined,
        },
        error: "Failed to resolve table names.",
      };
    }

    // Get active users stats
    const activeUsersResult = await getActiveUsersStats();

    // Get inactive users count
    const inactiveUsersResult = await query<{ inactive_users: number }>(
      `SELECT COUNT(*) as inactive_users FROM \`${usersTable}\` WHERE status = 'inactive'`
    );
    const inactiveUsers = inactiveUsersResult.data?.[0]?.inactive_users || 0;

    // Get article stats
    const articleStatsResult = await getArticleStats();

    // Get total likes count
    const totalLikesResult = await query<{ total_likes: number }>(
      `SELECT COUNT(*) as total_likes FROM \`${likesTable}\``
    );
    const totalLikes = totalLikesResult.data?.[0]?.total_likes || 0;

    // Get article with greatest likes
    const mostLikedArticleResult = await query<{
      id: number;
      title: string;
      likes_count: number;
    }>(
      `SELECT 
        a.id,
        a.title,
        COUNT(l.id) as likes_count
       FROM \`${articlesTable}\` a
       LEFT JOIN \`${likesTable}\` l ON a.id = l.article_id
       GROUP BY a.id, a.title
       ORDER BY likes_count DESC
       LIMIT 1`
    );
    const mostLikedArticle =
      mostLikedArticleResult.data && mostLikedArticleResult.data.length > 0
        ? {
            id: mostLikedArticleResult.data[0].id,
            title: mostLikedArticleResult.data[0].title,
            likes_count: Number(mostLikedArticleResult.data[0].likes_count || 0),
          }
        : undefined;

    // Get total comments count
    const totalCommentsResult = await query<{ total_comments: number }>(
      `SELECT COUNT(*) as total_comments FROM \`${commentsTable}\``
    );
    const totalComments = totalCommentsResult.data?.[0]?.total_comments || 0;

    // Get page views in last 30 days
    const pageViews30DaysResult = await query<{ page_views: number }>(
      `SELECT COUNT(*) as page_views FROM \`${viewsTable}\` 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );
    const pageViewsLast30Days = pageViews30DaysResult.data?.[0]?.page_views || 0;

    // Get new users in last 30 days
    const newUsers30DaysResult = await query<{ new_users: number }>(
      `SELECT COUNT(*) as new_users FROM \`${usersTable}\` 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );
    const newUsersLast30Days = newUsers30DaysResult.data?.[0]?.new_users || 0;

    // Get trending topics count (trending articles)
    const trendingTopicsResult = await query<{ trending_count: number }>(
      `SELECT COUNT(*) as trending_count FROM \`${articlesTable}\` 
       WHERE is_trending = 1`
    );
    const trendingTopics = trendingTopicsResult.data?.[0]?.trending_count || 0;

    // Return combined stats
    return {
      data: {
        activeUsers: activeUsersResult.data?.activeUsers || 0,
        inactiveUsers: Number(inactiveUsers),
        activeUsersTrend: 0,
        totalArticles: articleStatsResult.data?.totalArticles || 0,
        totalLikes: Number(totalLikes),
        totalComments: Number(totalComments),
        pageViewsLast30Days: Number(pageViewsLast30Days),
        newUsersLast30Days: Number(newUsersLast30Days),
        trendingTopics: Number(trendingTopics),
        mostLikedArticle,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: {
        activeUsers: 0,
        inactiveUsers: 0,
        activeUsersTrend: 0,
        totalArticles: 0,
        totalLikes: 0,
        totalComments: 0,
        pageViewsLast30Days: 0,
        newUsersLast30Days: 0,
        trendingTopics: 0,
        mostLikedArticle: undefined,
      },
      error: error instanceof Error ? error.message : "Failed to fetch dashboard stats",
    };
  }
}

interface TrendingArticle {
  id: number;
  title: string;
  likes_count: number;
  comments_count: number;
  published_at: string;
}

export async function getTrendingArticles(): Promise<{
  data: TrendingArticle[] | null;
  error: string | null;
}> {
  try {
    // Resolve table names
    const [articlesTable, likesTable, commentsTable] = await Promise.all([
      resolveTableName("Articles"),
      resolveTableName("Likes"),
      resolveTableName("Comments"),
    ]);

    if (!articlesTable || !likesTable || !commentsTable) {
      return {
        data: null,
        error: "Failed to resolve table names.",
      };
    }

    // Get trending articles with likes and comments counts
    const result = await query<TrendingArticle & { likes_count: number; comments_count: number }>(
      `SELECT 
        a.id, 
        a.title, 
        a.published_at,
        COALESCE(COUNT(DISTINCT l.id), 0) as likes_count,
        COALESCE(COUNT(DISTINCT c.id), 0) as comments_count
       FROM \`${articlesTable}\` a
       LEFT JOIN \`${likesTable}\` l ON a.id = l.article_id
       LEFT JOIN \`${commentsTable}\` c ON a.id = c.article_id
       WHERE a.is_trending = 1 
       GROUP BY a.id, a.title, a.published_at
       ORDER BY (likes_count + comments_count) DESC 
       LIMIT 3`
    );

    if (result.error) {
      throw new Error("Failed to fetch trending articles");
    }

    const articles = (result.data || []).map((article) => ({
      id: article.id,
      title: article.title,
      likes_count: Number(article.likes_count || 0),
      comments_count: Number(article.comments_count || 0),
      published_at: article.published_at,
    }));

    return {
      data: articles,
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
  type: string;
}

export async function getRecentActivity(): Promise<{
  data: RecentActivity[] | null;
  error: string | null;
}> {
  try {
    // Resolve table names
    const [commentsTable, articlesTable, usersTable, likesTable] = await Promise.all([
      resolveTableName("Comments"),
      resolveTableName("Articles"),
      resolveTableName("Users"),
      resolveTableName("Likes"),
    ]);

    if (!commentsTable || !articlesTable || !usersTable || !likesTable) {
      return {
        data: null,
        error: "Failed to resolve table names.",
      };
    }

    // Get recent activities from comments, articles, users, and likes with article titles
    const result = await query<RecentActivity>(
      `(
        SELECT 
          c.id,
          'comment' as type,
          CONCAT('New comment on: ', a.title) as description,
          c.created_at
        FROM \`${commentsTable}\` c
        LEFT JOIN \`${articlesTable}\` a ON c.article_id = a.id
        ORDER BY c.created_at DESC
        LIMIT 2
      )
      UNION ALL
      (
        SELECT 
          id,
          'article' as type,
          CONCAT('New article: ', title) as description,
          published_at as created_at
        FROM \`${articlesTable}\`
        ORDER BY published_at DESC
        LIMIT 1
      )
      UNION ALL
      (
        SELECT 
          id,
          'user' as type,
          CONCAT('New user registered: ', firstname, ' ', lastname) as description,
          created_at
        FROM \`${usersTable}\`
        ORDER BY created_at DESC
        LIMIT 1
      )
      UNION ALL
      (
        SELECT 
          l.id,
          'like' as type,
          CONCAT('New like on: ', a.title) as description,
          l.created_at
        FROM \`${likesTable}\` l
        LEFT JOIN \`${articlesTable}\` a ON l.article_id = a.id
        ORDER BY l.created_at DESC
        LIMIT 1
      )
      ORDER BY created_at DESC
      LIMIT 5`
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

interface CategorySubcategoryStats {
  name: string;
  articles_count: number;
  type: "category" | "subcategory";
}

export async function getCategorySubcategoryStats(): Promise<{
  data: CategorySubcategoryStats[] | null;
  error: string | null;
}> {
  try {
    // Resolve table names
    const [articlesTable, categoriesTable, subcategoriesTable] = await Promise.all([
      resolveTableName("Articles"),
      resolveTableName("Categories"),
      resolveTableName("SubCategories"),
    ]);

    if (!articlesTable || !categoriesTable || !subcategoriesTable) {
      return {
        data: null,
        error: "Failed to resolve table names.",
      };
    }

    // Get articles count by categories and subcategories
    const result = await query<CategorySubcategoryStats>(
      `(
        SELECT 
          c.name as name,
          COUNT(DISTINCT a.id) as articles_count,
          'category' as type
        FROM \`${categoriesTable}\` c
        LEFT JOIN \`${articlesTable}\` a ON c.id = a.category_id
        GROUP BY c.id, c.name
      )
      UNION ALL
      (
        SELECT 
          sc.name as name,
          COUNT(DISTINCT a.id) as articles_count,
          'subcategory' as type
        FROM \`${subcategoriesTable}\` sc
        LEFT JOIN \`${articlesTable}\` a ON sc.id = a.sub_category_id
        GROUP BY sc.id, sc.name
      )
      ORDER BY articles_count DESC
      LIMIT 10`
    );

    if (result.error) {
      throw new Error("Failed to fetch category/subcategory stats");
    }

    const stats = (result.data || []).map((item) => ({
      name: item.name,
      articles_count: Number(item.articles_count || 0),
      type: item.type as "category" | "subcategory",
    }));

    return {
      data: stats,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch category/subcategory stats",
    };
  }
} 