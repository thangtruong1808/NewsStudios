import { query } from "../db/db";

interface UserStats {
  activeUsers: number;
  activeUsersTrend: number;
}

type ActiveUsersRow = {
  status: number;
} & Record<string, unknown>;

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

    const result = await query<ActiveUsersRow>(activeUsersQuery);

    if (result.error) {
      const errorMessage = result.error;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
    }

    // Map the data to match the expected structure
    const rows = Array.isArray(result.data)
      ? (result.data as ActiveUsersRow[])
      : [];
    const activeUsers = rows.length > 0 ? Number(rows[0].status ?? 0) : 0;

    // Return the data in the format expected by the dashboard
    const stats: UserStats = {
      activeUsers: activeUsers,
      activeUsersTrend: 0, // No trend calculation needed
    };

    return {
      data: stats,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch active users stats",
    };
  }
} 