"use client";

// Component to display related articles with optional current article filtering
import { useState, useEffect } from "react";
import { getFrontEndRelativeArticles } from "@/app/lib/actions/front-end-relative-articles";
import { Article } from "@/app/lib/definition";
import Grid from "@/app/components/front-end/shared/Grid";
import Card from "@/app/components/front-end/shared/Card";

import RelativeArticlesSkeleton from "./RelativeArticlesSkeleton";

// Props interface for RelatedArticles component
interface RelativeArticles {
  currentArticleId?: string; // Optional ID of current article to exclude from results
}

export default function RelativeArticles({
  currentArticleId,
}: RelativeArticles) {
  // State management for articles, loading state, and error handling
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // Fetch and filter related articles on component mount or when currentArticleId changes
  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getFrontEndRelativeArticles(
          currentArticleId ? Number(currentArticleId) : undefined,
          page,
          ITEMS_PER_PAGE
        );

        if (result.error) {
          throw new Error(result.error);
        }

        const newArticles = result.data || [];
        if (page === 1) {
          setRelatedArticles(newArticles);
        } else {
          setRelatedArticles((prev) => [...prev, ...newArticles]);
        }
        setTotalCount(result.totalCount || 0);

        // Calculate total loaded articles
        const totalLoaded =
          page === 1
            ? newArticles.length
            : relatedArticles.length + newArticles.length;
        // Only show Load More if we have more articles to load and we received a full page
        setHasMore(
          result.totalCount > totalLoaded &&
          newArticles.length === ITEMS_PER_PAGE
        );
      } catch (error) {
        console.error("Error fetching related articles:", error);
        setError("Failed to load related articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [currentArticleId, page]);

  // Handle load more click
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Error state display
  if (error) {
    return (
      <section className="mb-16">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Loading state display
  if (isLoading) {
    return <RelativeArticlesSkeleton />;
  }

  // Main component render with loading state and article grid
  return (
    <>
      {/* Header section with title and description - Full width background */}
      <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw] mb-4">
        <div className="max-w-[1536px] mx-auto">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Related Articles
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Discover more articles you might be interested in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <section className="mt-2">
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
          <div className="max-w-[1536px] mx-auto px-6">
            {relatedArticles.length > 0 ? (
              <>
                {/* Grid layout for related articles using custom grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6">
                  {relatedArticles.map((article) => {
                    // Split tag strings into arrays safely
                    const tagNames = (() => {
                      const tagNamesValue = article.tag_names as string | string[] | undefined;
                      if (typeof tagNamesValue === "string") {
                        return tagNamesValue.split(",").filter(Boolean);
                      }
                      if (Array.isArray(tagNamesValue)) {
                        return tagNamesValue;
                      }
                      return [];
                    })();

                    const tagColors = (() => {
                      const tagColorsValue = article.tag_colors as string | string[] | undefined;
                      if (typeof tagColorsValue === "string") {
                        return tagColorsValue.split(",").filter(Boolean);
                      }
                      if (Array.isArray(tagColorsValue)) {
                        return tagColorsValue;
                      }
                      return [];
                    })();

                    return (
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
                        viewsCount={article.views_count}
                        likesCount={article.likes_count}
                        commentsCount={article.comments_count}
                        tags={tagNames}
                        tagColors={tagColors}
                      />
                    );
                  })}
                </div>

                {/* Load More Button */}
                {hasMore && relatedArticles.length >= 5 && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Empty state display
              <div className="text-center py-8 text-gray-500">
                <p>No related articles found.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
