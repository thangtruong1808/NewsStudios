import { query } from "./query";

const tableNameCache = new Map<string, string>();

// Component Info
// Description: Utility to resolve actual table casing per database engine.
// Date created: 2025-01-27
// Author: thangtruong

export async function resolveTableName(preferredName: string): Promise<string> {
  // Validate input - must be non-empty string
  if (!preferredName || typeof preferredName !== "string" || preferredName.trim() === "") {
    throw new Error("Invalid table name provided");
  }

  // Return cached value if available
  const cached = tableNameCache.get(preferredName);
  if (cached && cached.trim() !== "") {
    return cached;
  }

  // Generate common case variations to test
  // Order matters: try lowercase first (localhost), then capitalized (Vercel)
  const firstChar = preferredName.charAt(0);
  const rest = preferredName.slice(1);
  const variations = [
    preferredName.toLowerCase(), // articles (localhost)
    firstChar.toUpperCase() + rest.toLowerCase(), // Articles (Vercel)
    preferredName, // Original case
    preferredName.toUpperCase(), // ARTICLES
  ];

  // Remove duplicates while preserving order
  const uniqueVariations = Array.from(new Set(variations));

  try {
    // Method 1: Query information_schema with case-insensitive search
    const lowerName = preferredName.toLowerCase();
    const result = await query<{ table_name: string }>(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = DATABASE() AND LOWER(table_name) = ?
       LIMIT 1`,
      [lowerName]
    );

    // If information_schema query succeeds, use the resolved name
    if (!result.error && result.data && result.data.length > 0) {
      const resolved = result.data[0].table_name;
      tableNameCache.set(preferredName, resolved);
      return resolved;
    }

    // Method 2: Try each variation with exact match in information_schema
    for (const variation of uniqueVariations) {
      const exactMatchResult = await query<{ table_name: string }>(
        `SELECT table_name
         FROM information_schema.tables
         WHERE table_schema = DATABASE() AND table_name = ?
         LIMIT 1`,
        [variation]
      );

      if (!exactMatchResult.error && exactMatchResult.data && exactMatchResult.data.length > 0) {
        const resolved = exactMatchResult.data[0].table_name;
        tableNameCache.set(preferredName, resolved);
        return resolved;
      }
    }
    
    // Method 3: Direct table test - try each variation by querying the table directly
    // This handles cases where information_schema might not be accessible
    // Check for table existence by attempting a simple SELECT query
    for (const variation of uniqueVariations) {
      try {
        const testResult = await query<unknown>(
          `SELECT 1 FROM \`${variation}\` LIMIT 1`
        );
        
        // If query succeeds without error, table exists with this name
        if (!testResult.error && testResult.data !== null) {
          tableNameCache.set(preferredName, variation);
          return variation;
        }
      } catch {
        // Table doesn't exist with this variation, continue to next
        continue;
      }
    }
    
    // Method 4: Last resort - try lowercase first (common for localhost)
    // Then try capitalized (common for production/Vercel)
    const fallbackOrder = [
      preferredName.toLowerCase(),
      firstChar.toUpperCase() + rest.toLowerCase(),
    ];
    
    for (const fallback of fallbackOrder) {
      try {
        const testResult = await query<unknown>(
          `SELECT 1 FROM \`${fallback}\` LIMIT 1`
        );
        if (!testResult.error && testResult.data !== null) {
          tableNameCache.set(preferredName, fallback);
          return fallback;
        }
      } catch {
        // Continue to next fallback
        continue;
      }
    }
    
    // Final fallback: return lowercase (most common for localhost MySQL)
    // This ensures we always return a valid string, even if table doesn't exist
    const finalFallback = preferredName.toLowerCase();
    tableNameCache.set(preferredName, finalFallback);
    return finalFallback;
  } catch (_error) {
    // If all resolution attempts fail, try lowercase first, then capitalized
    const errorFallbackOrder = [
      preferredName.toLowerCase(),
      firstChar.toUpperCase() + rest.toLowerCase(),
    ];
    
    // Try to test which one works
    for (const fallback of errorFallbackOrder) {
      try {
        const testResult = await query<unknown>(
          `SELECT 1 FROM \`${fallback}\` LIMIT 1`
        );
        if (!testResult.error && testResult.data !== null) {
          tableNameCache.set(preferredName, fallback);
          return fallback;
        }
      } catch {
        // Continue to next fallback
        continue;
      }
    }
    
    // Last resort: return lowercase (most common for localhost)
    // This ensures we always return a valid string
    const finalFallback = preferredName.toLowerCase();
    tableNameCache.set(preferredName, finalFallback);
    return finalFallback;
  }
}

