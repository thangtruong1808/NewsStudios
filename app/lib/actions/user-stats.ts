import { query } from "../db/db";

interface UserStats {
  activeUsers: number;
  activeUsersTrend: number;
}

export async function getActiveUsersStats(): Promise<{
  data: UserStats | null;
  error: string | null;
}> {
  try {
    const result = await query(
      `SELECT COUNT(*) as activeUsers 
       FROM users 
       WHERE last_login_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    if (result.error) {
      return {
        data: null,
        error: result.error
      };
    }

    const activeUsers = result.data?.[0]?.activeUsers || 0;

    return {
      data: {
        activeUsers: Number(activeUsers),
        activeUsersTrend: 0
      },
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch active users stats'
    };
  }
} 