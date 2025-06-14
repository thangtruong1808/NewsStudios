"use client";

// Component to display articles filtered by subcategory in a 5x5 grid layout
import { useState, useEffect } from "react";
import { getSubcategoryArticles } from "@/app/lib/actions/front-end-articles";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import Grid from "@/app/components/front-end/shared/Grid";
import Card from "@/app/components/front-end/shared/Card";
import { FolderIcon } from "@heroicons/react/24/outline";

// Props interface for subcategory filtering
type Props = {
  subcategory?: string;
};

export default function SubcategoryArticles({ subcategory }: Props) {
  // State management for articles, loading, error, and pagination
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [subcategoryInfo, setSubcategoryInfo] = useState<{
    name: string;
    category_name: string;
  } | null>(null);
  const itemsPerPage = 25; // 5 columns * 5 rows

  // Fetch articles when subcategory or page changes
  useEffect(() => {
    const fetchArticles = async () => {
      if (!subcategory) return;

      try {
        setIsLoading(true);
        const result = await getSubcategoryArticles({
          subcategoryId: subcategory,
          page: currentPage,
          itemsPerPage,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        setArticles(result.data || []);
        setTotalCount(result.totalCount || 0);

        // Set subcategory info from the first article
        if (result.data && result.data.length > 0) {
          setSubcategoryInfo({
            name: result.data[0].subcategory_name || "",
            category_name: result.data[0].category_name || "",
          });
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch articles"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [subcategory, currentPage]);

  // Loading state display
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state display
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  // Empty state display
  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {subcategory
            ? "No articles found in this subcategory."
            : "No articles found."}
        </p>
      </div>
    );
  }

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="w-full max-w-[1536px] mx-auto px-4 mt-10">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100">
              <FolderIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {subcategoryInfo?.name || "Articles"}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <FolderIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Category:
                  </span>
                  <span className="text-sm text-gray-600">
                    {subcategoryInfo?.category_name || "Uncategorized"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FolderIcon className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Subcategory:
                  </span>
                  <span className="text-sm text-indigo-600">
                    {subcategoryInfo?.name || "All"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Total Articles:
                  </span>
                  <span className="text-sm text-gray-600">{totalCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5x5 Grid layout for articles */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Grid columns={5} gap="lg">
          {articles.map((article) => (
            <Card
              key={article.id}
              title={article.title}
              description={article.content}
              imageUrl={article.image}
              link={`/article/${article.id}`}
              category={article.category_name}
              subcategory={article.subcategory_name}
              author={article.author_name}
              date={article.published_at}
              viewsCount={article.views_count}
              likesCount={article.likes_count}
              commentsCount={article.comments_count}
              tags={article.tag_names}
              tagColors={article.tag_colors}
            />
          ))}
        </Grid>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
