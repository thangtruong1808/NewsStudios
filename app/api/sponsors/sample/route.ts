import { insertSampleSponsors } from "@/app/lib/actions/sponsors";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await insertSampleSponsors();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to insert sample sponsors" },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error inserting sample sponsors:", error);
    return NextResponse.json(
      { error: "Failed to insert sample sponsors" },
      { status: 500 }
    );
  }
}
