import { insertSampleAdvertisements } from "@/app/lib/actions/advertisements";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await insertSampleAdvertisements();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to insert sample advertisements" },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error inserting sample advertisements:", error);
    return NextResponse.json(
      { error: "Failed to insert sample advertisements" },
      { status: 500 }
    );
  }
}
