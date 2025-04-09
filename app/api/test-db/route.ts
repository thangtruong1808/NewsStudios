import { NextResponse } from "next/server";
import { query } from "../../lib/db/db";

export async function GET() {
  try {
    // Test the database connection with a simple query
    const result = await query("SELECT 1 as test");

    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: "Database connection failed",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: result.data,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
