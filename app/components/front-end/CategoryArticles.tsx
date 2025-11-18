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

// Component Info
// Description: Render category-filtered articles grid with pagination support.
// Date created: 2024-12-19
// Author: thangtruong

export default function CategoryArticles({ categoryId }: Props) {
  // State: track articles and loading/error flags
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

  // Fetch category info when categoryId changes
  useEffect(() => {
    const fetchCategoryInfo = async () => {
      if (!categoryId) return;

      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: "GET",
          cache: "no-store",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setCategoryInfo({ name: result.data.name || "Articles" });
          }
        }
      } catch (_error) {
        // Silent: category info is optional
      }
    };

    fetchCategoryInfo();
  }, [categoryId]);

  // Effects: fetch category articles via API route
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

        // Set category info from first article if available
        if (newArticles.length > 0 && currentPage === 1 && !categoryInfo) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Error state: display friendly message with header section
  if (error) {
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] mb-8">
          <div className="max-w-[1536px] mx-auto px-6">
            <div className="bg-red-50 border border-red-200 rounded-xl shadow-sm p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                  <FolderIcon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-red-900">Error Loading Articles</h3>
                <p className="text-red-700 max-w-md">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Empty state: friendly message when no articles found
  if (articles.length === 0 && !error) {
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
                      <span className="text-sm text-gray-600">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty state message */}
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] mb-8">
          <div className="max-w-[1536px] mx-auto px-6">
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
                  <FolderIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  No Articles Found
                </h3>
                <p className="text-gray-500 max-w-md">
                  {categoryInfo?.name
                    ? `We couldn't find any articles in the "${categoryInfo.name}" category. Check back later or explore other categories!`
                    : "We couldn't find any articles in this category. Check back later or explore other categories!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
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
