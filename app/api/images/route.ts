import { NextResponse } from "next/server";
import { getImages } from "../../lib/actions/images";

export async function GET() {
  try {
    const result = await getImages();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in images API route:", error);
    return NextResponse.json(
      { data: [], error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
