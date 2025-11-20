// Component Info
// Description: Server action for fetching user statistics from database.
// Date updated: 2025-November-21
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
    // Resolve table name with proper casing - with fallback to preferred name
    let usersTable: string;

    try {
      usersTable = await resolveTableName("Users");
      usersTable = usersTable || "Users";
    } catch (_resolveError) {
      // Fallback to preferred name if resolution fails
      usersTable = "Users";
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