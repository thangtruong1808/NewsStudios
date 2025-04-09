import { NextResponse } from "next/server";
import { testFileUpload } from "../../lib/utils/test-upload";

export async function GET() {
  try {
    const result = await testFileUpload();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in test upload API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to test file upload",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
