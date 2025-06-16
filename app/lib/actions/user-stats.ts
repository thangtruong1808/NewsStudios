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
    // Get active users count
    const activeUsersQuery = `
      SELECT COUNT(*) as status
      FROM Users
      WHERE status = 'active'
    `;

    const result = await query(activeUsersQuery);

    if (result.error) {
      const errorMessage = result.error;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
    }

    // Log the result for debugging
    console.log('Active users result:', result);

    // Map the data to match the expected structure
    const activeUsers = result.data?.[0]?.status || 0;
    console.log('Mapped active users count:', activeUsers);

    // Return the data in the format expected by the dashboard
    const stats: UserStats = {
      activeUsers: activeUsers,
      activeUsersTrend: 0, // No trend calculation needed
    };

    console.log('Returning stats:', stats);

    return {
      data: stats,
      error: null,
    };
  } catch (error) {
    console.error('Error in getActiveUsersStats:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch active users stats",
    };
  }
} 