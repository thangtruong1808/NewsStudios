import { query } from "../db/db";

interface ActiveUsersResult {
  active_users: number;
}

/**
 * Get active users based on various activities:
 * - Comments
 * - Article views
 * - Article interactions (likes, shares)
 * - User logins
 * 
 * A user is considered active if they have performed any of these actions in the last 30 days
 */
export async function getActiveUsers(): Promise<{
  data: number | null;
  error: string | null;
}> {
  try {
    const result = await query<ActiveUsersResult>(
      `WITH user_activities AS (
        -- Get users who commented
        SELECT 
          user_id,
          MAX(created_at) as last_activity,
          'comment' as activity_type
        FROM comments
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY user_id

        UNION

        -- Get users who viewed articles
        SELECT 
          user_id,
          MAX(viewed_at) as last_activity,
          'view' as activity_type
        FROM article_views
        WHERE viewed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY user_id

        UNION

        -- Get users who interacted with articles (likes, shares)
        SELECT 
          user_id,
          MAX(created_at) as last_activity,
          'interaction' as activity_type
        FROM article_interactions
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY user_id

        UNION

        -- Get users who logged in
        SELECT 
          user_id,
          MAX(login_at) as last_activity,
          'login' as activity_type
        FROM user_logins
        WHERE login_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY user_id
      )
      SELECT COUNT(DISTINCT user_id) as active_users
      FROM user_activities`
    );

    if (result.error) {
      throw new Error("Failed to fetch active users");
    }

    return {
      data: result.data?.[0]?.active_users || 0,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch active users",
    };
  }
}

/**
 * Get active users trend (percentage change from previous period)
 */
export async function getActiveUsersTrend(): Promise<{
  data: number | null;
  error: string | null;
}> {
  try {
    const result = await query<{ current: number; previous: number }>(
      `WITH current_period AS (
        SELECT COUNT(DISTINCT user_id) as count
        FROM (
          SELECT user_id FROM comments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          UNION
          SELECT user_id FROM article_views WHERE viewed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          UNION
          SELECT user_id FROM article_interactions WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          UNION
          SELECT user_id FROM user_logins WHERE login_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ) as current_activities
      ),
      previous_period AS (
        SELECT COUNT(DISTINCT user_id) as count
        FROM (
          SELECT user_id FROM comments WHERE created_at BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY) AND DATE_SUB(NOW(), INTERVAL 30 DAY)
          UNION
          SELECT user_id FROM article_views WHERE viewed_at BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY) AND DATE_SUB(NOW(), INTERVAL 30 DAY)
          UNION
          SELECT user_id FROM article_interactions WHERE created_at BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY) AND DATE_SUB(NOW(), INTERVAL 30 DAY)
          UNION
          SELECT user_id FROM user_logins WHERE login_at BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY) AND DATE_SUB(NOW(), INTERVAL 30 DAY)
        ) as previous_activities
      )
      SELECT 
        current_period.count as current,
        previous_period.count as previous
      FROM current_period, previous_period`
    );

    if (result.error) {
      throw new Error("Failed to fetch active users trend");
    }

    const current = result.data?.[0]?.current || 0;
    const previous = result.data?.[0]?.previous || 0;
    
    // Calculate percentage change
    const percentageChange = previous === 0 
      ? 100 
      : ((current - previous) / previous) * 100;

    return {
      data: Math.round(percentageChange),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch active users trend",
    };
  }
} 