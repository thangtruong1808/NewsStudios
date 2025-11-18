import { query } from "./query";

const tableNameCache = new Map<string, string>();

// Component Info
// Description: Utility to resolve actual table casing per database engine.
// Date created: 2024
// Author: thangtruong

export async function resolveTableName(preferredName: string): Promise<string> {
  // Return cached value if available
  const cached = tableNameCache.get(preferredName);
  if (cached) {
    return cached;
  }

  // Query information_schema to find actual table name
  const lowerName = preferredName.toLowerCase();
  const result = await query<{ table_name: string }>(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = DATABASE() AND LOWER(table_name) = ?
     LIMIT 1`,
    [lowerName]
  );

  // Resolve table name or fallback to preferred name
  const resolved =
    result.data && result.data.length > 0 && result.data[0]?.table_name
      ? result.data[0].table_name
      : preferredName;

  // Cache and return resolved name
  tableNameCache.set(preferredName, resolved);
  return resolved;
}

