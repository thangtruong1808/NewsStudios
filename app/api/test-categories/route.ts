import { NextResponse } from "next/server";
import { getPool } from "../../lib/db/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const pool = await getPool();
    // First check if the Categories table exists
    const tableCheck = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'Categories'",
      [process.env.DB_NAME]
    );

    if (!tableCheck[0] || tableCheck[0][0].count === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Categories table does not exist",
          error: "Table not found",
        },
        { status: 404 }
      );
    }

    // If table exists, fetch categories
    const result = await pool.query<RowDataPacket[]>(
      "SELECT id, name, description FROM Categories ORDER BY id"
    );

    return NextResponse.json({
      success: true,
      message: "Categories fetched successfully",
      data: result[0],
      count: result[0].length,
    });
  } catch (error) {
    console.error("Error testing Categories table:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to test Categories table",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
