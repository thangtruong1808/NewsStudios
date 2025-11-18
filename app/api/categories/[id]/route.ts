import { NextResponse } from "next/server";
import { getCategoryById } from "@/app/lib/actions/categories";

// Component Info
// Description: API route handler for fetching category by ID.
// Date created: 2024-12-19
// Author: thangtruong

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const categoryId = params.id;

  if (!categoryId) {
    return NextResponse.json(
      { data: null, error: "Category ID is required" },
      { status: 400 }
    );
  }

  const result = await getCategoryById(parseInt(categoryId));

  if (result.error) {
    return NextResponse.json(
      { data: null, error: result.error },
      { status: 400 }
    );
  }

  return NextResponse.json(result);
}

