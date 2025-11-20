// Component Info
// Description: API route handler for fetching category by ID.
// Date updated: 2025-November-21
// Author: thangtruong

import { NextResponse } from "next/server";
import { getCategoryById } from "@/app/lib/actions/categories";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const categoryId = id;

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

