"use client";

// Component Info
// Description: Client component displaying search results with filters and pagination.
// Date updated: 2025-November-21
// Author: thangtruong

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchArticles } from "@/app/lib/actions/search-articles";
import Card from "@/app/components/front-end/shared/Card";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ScrollButtons from "@/app/components/front-end/shared/ScrollButtons";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Get search parameters from URL
  const searchQuery = searchParams.get("q") || "";
  const categoryIdsParam = searchParams.get("categories");
  const subcategoryIdsParam = searchParams.get("subcategories");

  // Memoize arrays to prevent infinite loops
  const categoryIds = useMemo(() => {
    return categoryIdsParam ? categoryIdsParam.split(",").map(Number).filter(Boolean) : [];
  }, [categoryIdsParam]);

  const subcategoryIds = useMemo(() => {
    return subcategoryIdsParam ? subcategoryIdsParam.split(",").map(Number).filter(Boolean) : [];
  }, [subcategoryIdsParam]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await searchArticles({
          search: searchQuery,
          categoryIds,
          subcategoryIds,
          page,
          limit: ITEMS_PER_PAGE,
        });
        if (result.error) throw new Error(result.error);
        setArticles(result.data || []);
        setTotalCount(result.totalCount || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load search results");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [searchQuery, categoryIds, subcategoryIds, page]);

  // Reset to page 1 when search params change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, categoryIdsParam, subcategoryIdsParam]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading search results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
      <div className="max-w-[1536px] mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 shadow-sm">
              <MagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
              <p className="text-sm text-gray-600 mt-1">
                {totalCount > 0 ? `Found ${totalCount} article${totalCount !== 1 ? "s" : ""}` : "No articles found"}
              </p>
            </div>
          </div>
          {/* Active filters */}
          {(searchQuery || categoryIds.length > 0 || subcategoryIds.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Title: {searchQuery}
                </span>
              )}
              {categoryIds.length > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  {categoryIds.length} categor{categoryIds.length !== 1 ? "ies" : "y"} selected
                </span>
              )}
              {subcategoryIds.length > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  {subcategoryIds.length} subcategor{subcategoryIds.length !== 1 ? "ies" : "y"} selected
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results grid */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
                <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">No Articles Found</h3>
              <p className="text-gray-500 max-w-md">Try adjusting your search criteria or filters to find more articles.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {articles.map((article) => (
                <Card
                  key={article.id}
                  title={article.title}
                  description={article.content}
                  imageUrl={article.image}
                  link={`/articles/${article.id}`}
                  date={article.published_at instanceof Date ? article.published_at.toISOString() : String(article.published_at || "")}
                  author={article.author_name}
                  category={article.category_name}
                  subcategory={article.subcategory_name}
                  tags={article.tag_names}
                  tagColors={article.tag_colors}
                  likesCount={article.likes_count}
                  commentsCount={article.comments_count}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
}

export default function SearchPageClient() {
  return (
    <Suspense fallback={<div className="py-12 text-center">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}

