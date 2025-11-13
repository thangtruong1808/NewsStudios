import { NextResponse } from "next/server";
import { getSubcategoryArticles } from "@/app/lib/actions/front-end-articles";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const subcategoryId = url.searchParams.get("subcategoryId");
  const pageParam = url.searchParams.get("page");
  const itemsPerPageParam = url.searchParams.get("itemsPerPage");

  if (!subcategoryId) {
    return NextResponse.json(
      { data: [], totalCount: 0, error: "subcategoryId is required" },
      { status: 400 }
    );
  }

  const page = Number(pageParam ?? "1");
  const itemsPerPage = Number(itemsPerPageParam ?? "10");

  const result = await getSubcategoryArticles({
    subcategoryId,
    page: Number.isNaN(page) ? 1 : page,
    itemsPerPage: Number.isNaN(itemsPerPage) ? 10 : itemsPerPage,
  });

  return NextResponse.json(result);
}

