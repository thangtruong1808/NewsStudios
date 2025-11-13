"use client";

import { useState, useEffect, useRef } from "react";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import Card from "@/app/components/front-end/shared/Card";
import { FolderIcon } from "@heroicons/react/24/outline";
import CategoryArticlesSkeleton from "./CategoryArticlesSkeleton";

type Props = {
  categoryId?: string;
};

type CategoryArticlesResponse = {
  data: Article[];
  totalCount: number;
  error: string | null;
};

// Description: Render category-filtered articles grid with pagination support.
// Data created: 2024-11-13
// Author: thangtruong
export default function CategoryArticles({ categoryId }: Props) {
  // State: track articles and loading/error flags.
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categoryInfo, setCategoryInfo] = useState<{ name: string } | null>(
    null
  );
  const itemsPerPage = 10;
  const [hasMore, setHasMore] = useState(false);
  const articlesRef = useRef<Article[]>([]);

  // Handlers: pagination load-more trigger.
  const handleLoadMore = () => {
    if (isLoading) return;
    setCurrentPage((prev) => prev + 1);
  };

  // Effects: fetch category articles via API route.
  useEffect(() => {
    const fetchArticles = async () => {
      if (!categoryId) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/articles/category?categoryId=${encodeURIComponent(
            categoryId
          )}&page=${currentPage}&itemsPerPage=${itemsPerPage}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const result = (await response.json()) as CategoryArticlesResponse;

        if (result.error) {
          throw new Error(result.error);
        }

        const newArticles = Array.isArray(result.data) ? result.data : [];

        if (currentPage === 1) {
          setArticles(newArticles);
          articlesRef.current = newArticles;
        } else {
          const updatedArticles = [...articlesRef.current, ...newArticles];
          articlesRef.current = updatedArticles;
          setArticles(updatedArticles);
        }

        setTotalCount(result.totalCount ?? 0);
        setHasMore(result.totalCount > articlesRef.current.length);

        if (newArticles.length > 0 && currentPage === 1) {
          setCategoryInfo({
            name: newArticles[0].category_name || "Articles",
          });
        }
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to fetch articles"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [categoryId, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    setArticles([]);
    setHasMore(false);
    setCategoryInfo(null);
  }, [categoryId]);

  // Loading state: initial skeleton.
  if (isLoading && articles.length === 0) {
    return <CategoryArticlesSkeleton />;
  }

  // Error state: display friendly message.
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  // Empty state: nothing to show fallback.
  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {categoryId
            ? "No articles found in this category."
            : "No articles found."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header Section */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] m-8">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100">
                <FolderIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1 w-full">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {categoryInfo?.name || "Articles"}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <FolderIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Category:
                    </span>
                    <span className="text-sm text-gray-600">
                      {categoryInfo?.name || "Uncategorized"}
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
      </div>

      {/* Articles Grid */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] mb-8">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6">
            {articles.map((article) => (
              <Card
                key={article.id}
                title={article.title}
                description={article.content}
                imageUrl={article.image || undefined}
                link={`/articles/${article.id}`}
                category={article.category_name || undefined}
                subcategory={article.subcategory_name || undefined}
                author={article.author_name || undefined}
                date={article.published_at}
                viewsCount={article.views_count}
                likesCount={article.likes_count}
                commentsCount={article.comments_count}
                tags={article.tag_names}
                tagColors={article.tag_colors}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="m-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Loading...</span>
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
