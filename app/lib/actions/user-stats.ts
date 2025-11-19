// Component Info
// Description: Server action for fetching user statistics from database.
// Date created: 2025-01-27
// Author: thangtruong

import { query } from "../db/db";
import { resolveTableName } from "../db/tableNameResolver";

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
    // Resolve table name
    const usersTable = await resolveTableName("Users");

    if (!usersTable) {
      return {
        data: null,
        error: "Failed to resolve table name.",
      };
    }

    // Get active users count
    const activeUsersQuery = `
      SELECT COUNT(*) as status
      FROM \`${usersTable}\`
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
    const rows = Array.isArray(result.data) ? (result.data as ActiveUsersRow[]) : [];
    const activeUsers = rows.length > 0 ? Number(rows[0].status ?? 0) : 0;

    // Return the data in the format expected by the dashboard
    const stats: UserStats = {
      activeUsers: activeUsers,
      activeUsersTrend: 0,
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