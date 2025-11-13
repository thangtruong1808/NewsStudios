import { NextResponse } from "next/server";
import { getCategoryArticles } from "@/app/lib/actions/front-end-articles";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("categoryId");
  const pageParam = url.searchParams.get("page");
  const itemsPerPageParam = url.searchParams.get("itemsPerPage");

  if (!categoryId) {
    return NextResponse.json(
      { data: [], totalCount: 0, error: "categoryId is required" },
      { status: 400 }
    );
  }

  const page = Number(pageParam ?? "1");
  const itemsPerPage = Number(itemsPerPageParam ?? "10");

  const result = await getCategoryArticles({
    categoryId,
    page: Number.isNaN(page) ? 1 : page,
    itemsPerPage: Number.isNaN(itemsPerPage) ? 10 : itemsPerPage,
  });

  return NextResponse.json(result);
}

