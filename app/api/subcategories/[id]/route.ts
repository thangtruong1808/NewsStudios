// Component Info
// Description: API route handler for fetching subcategory by ID with category info.
// Date created: 2025-01-27
// Author: thangtruong

import { NextResponse } from "next/server";
import { getSubcategoryById } from "@/app/lib/actions/subcategories";
import { getCategoryById } from "@/app/lib/actions/categories";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const subcategoryId = id;

  if (!subcategoryId) {
    return NextResponse.json(
      { data: null, error: "Subcategory ID is required" },
      { status: 400 }
    );
  }

  const result = await getSubcategoryById(parseInt(subcategoryId));

  if (result.error) {
    return NextResponse.json(
      { data: null, error: result.error },
      { status: 400 }
    );
  }

  // Fetch category info if subcategory has category_id
  if (result.data?.category_id) {
    const categoryResult = await getCategoryById(result.data.category_id);
    if (categoryResult.data) {
      return NextResponse.json({
        data: {
          ...result.data,
          category_name: categoryResult.data.name,
        },
        error: null,
      });
    }
  }

  return NextResponse.json(result);
}

