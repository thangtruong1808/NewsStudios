"use client";

import { useState, useEffect, useRef } from "react";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import Card from "@/app/components/front-end/shared/Card";
import { FolderIcon } from "@heroicons/react/24/outline";
import SubcategoryArticlesSkeleton from "./SubcategoryArticlesSkeleton";
import ScrollButtons from "./shared/ScrollButtons";

type Props = {
  subcategory?: string;
};

type SubcategoryArticlesResponse = {
  data: Article[];
  totalCount: number;
  error: string | null;
};

type SubcategoryInfo = {
  name: string;
  category_name: string;
};

// Component Info
// Description: Render subcategory-filtered articles grid with pagination support.
// Date updated: 2025-November-21
// Author: thangtruong

export default function SubcategoryArticles({ subcategory }: Props) {
  // State: track articles and loading/error flags
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [subcategoryInfo, setSubcategoryInfo] = useState<SubcategoryInfo | null>(
    null
  );
  const itemsPerPage = 10;
  const [hasMore, setHasMore] = useState(false);
  const articlesRef = useRef<Article[]>([]);

  // Handlers: pagination load-more trigger
  const handleLoadMore = () => {
    if (isLoading) return;
    setCurrentPage((prev) => prev + 1);
  };

  // Fetch subcategory info when subcategory changes
  useEffect(() => {
    const fetchSubcategoryInfo = async () => {
      if (!subcategory) return;

      try {
        const response = await fetch(`/api/subcategories/${subcategory}`, {
          method: "GET",
          cache: "no-store",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setSubcategoryInfo({
              name: result.data.name || "Articles",
              category_name: result.data.category_name || "Uncategorized",
            });
          }
        }
      } catch (_error) {
        // Silent: subcategory info is optional
      }
    };

    fetchSubcategoryInfo();
  }, [subcategory]);

  // Effects: fetch subcategory articles via API route
  useEffect(() => {
    const fetchArticles = async () => {
      if (!subcategory) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/articles/subcategory?subcategoryId=${encodeURIComponent(
            subcategory
          )}&page=${currentPage}&itemsPerPage=${itemsPerPage}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const result = (await response.json()) as SubcategoryArticlesResponse;

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

        // Set subcategory info from first article if available
        if (newArticles.length > 0 && currentPage === 1 && !subcategoryInfo) {
          setSubcategoryInfo({
            name: newArticles[0].subcategory_name || "Articles",
            category_name: newArticles[0].category_name || "Uncategorized",
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
  }, [subcategory, currentPage]);

  // Effects: reset pagination when subcategory changes
  useEffect(() => {
    setCurrentPage(1);
    setArticles([]);
    setHasMore(false);
  }, [subcategory]);

  // Loading state: initial skeleton
  if (isLoading && articles.length === 0) {
    return <SubcategoryArticlesSkeleton />;
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
                    {subcategoryInfo?.name || "Articles"}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
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
                    {subcategoryInfo?.name || "Articles"}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
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
                  {subcategoryInfo?.name
                    ? `We couldn't find any articles in the "${subcategoryInfo.name}" subcategory${subcategoryInfo.category_name ? ` under the "${subcategoryInfo.category_name}" category` : ""}. Check back later or explore other categories!`
                    : "We couldn't find any articles in this subcategory. Check back later or explore other categories!"}
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
                  {subcategoryInfo?.name || "Articles"}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
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
                category={article.category_name}
                subcategory={article.subcategory_name}
                author={article.author_name}
                date={article.published_at}
                likesCount={article.likes_count}
                commentsCount={article.comments_count}
                tags={article.tag_names}
                tagColors={article.tag_colors}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 text-center">
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

      {/* Scroll buttons */}
      <ScrollButtons />
    </>
  );
}
