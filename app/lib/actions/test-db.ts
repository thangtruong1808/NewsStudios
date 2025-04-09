"use server";

import { query } from "../db/db";

export async function testDatabaseConnection() {
  try {
    const result = await query("SELECT 1 as test");

    if (result.error) {
      return {
        success: false,
        error: result.error,
        message: "Database connection failed",
      };
    }

    return {
      success: true,
      message: "Database connection successful",
      data: result.data,
    };
  } catch (error) {
    console.error("Database connection test error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      message: "Database connection test failed",
    };
  }
}
