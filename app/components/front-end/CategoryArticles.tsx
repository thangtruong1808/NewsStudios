"use client";

// Component to display articles filtered by category in a 5x5 grid layout
import { useState, useEffect, useRef } from "react";
import { getCategoryArticles } from "@/app/lib/actions/front-end-articles";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import Grid from "@/app/components/front-end/shared/Grid";
import Card from "@/app/components/front-end/shared/Card";
import { FolderIcon } from "@heroicons/react/24/outline";
import CategoryArticlesSkeleton from "./CategoryArticlesSkeleton";

// Props interface for category filtering
type Props = {
  categoryId?: string;
};

export default function CategoryArticles({ categoryId }: Props) {
  // State management for articles, loading, error, and pagination
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categoryInfo, setCategoryInfo] = useState<{
    name: string;
  } | null>(null);
  const itemsPerPage = 10; // Use same itemsPerPage for both initial load and load more
  const [hasMore, setHasMore] = useState(false);
  const articlesRef = useRef<Article[]>([]);

  // Handle load more click
  const handleLoadMore = () => {
    if (isLoading) return;
    setCurrentPage((prev) => prev + 1);
  };

  // Single useEffect to handle both initial load and pagination
  useEffect(() => {
    const fetchArticles = async () => {
      console.log("Fetching articles with categoryId:", categoryId);
      if (!categoryId) {
        console.log("No categoryId provided, returning");
        return;
      }

      try {
        setIsLoading(true);
        console.log("Loading state set to true");

        // Reset state when category changes
        if (currentPage === 1) {
          console.log("Resetting state for new category");
          setArticles([]);
          articlesRef.current = [];
          setHasMore(false);
        }

        console.log("Calling getCategoryArticles with:", {
          categoryId,
          page: currentPage,
          itemsPerPage,
        });

        const result = await getCategoryArticles({
          categoryId: categoryId,
          page: currentPage,
          itemsPerPage: itemsPerPage,
        });

        console.log("API Response:", {
          articlesCount: result.data?.length || 0,
          totalCount: result.totalCount,
          error: result.error,
        });

        if (result.error) {
          console.error("API returned error:", result.error);
          throw new Error(result.error);
        }

        const newArticles = result.data || [];
        console.log("New articles received:", newArticles.length);

        if (currentPage === 1) {
          // For page 1, just set the articles directly
          console.log("Setting initial articles");
          setArticles(newArticles);
          articlesRef.current = newArticles;
        } else {
          // For page 2+, simply append the new articles
          console.log("Appending new articles to existing ones");
          const updatedArticles = [...articlesRef.current, ...newArticles];
          articlesRef.current = updatedArticles;
          setArticles(updatedArticles);
        }

        // Set total count only once
        if (currentPage === 1) {
          console.log("Setting total count:", result.totalCount);
          setTotalCount(result.totalCount || 0);
        }

        // Calculate total loaded articles
        const totalLoaded = articlesRef.current.length;
        console.log("Total loaded articles:", totalLoaded);

        // Only show Load More if we have more articles to load
        const hasMoreArticles = result.totalCount > totalLoaded;
        console.log("Has more articles:", hasMoreArticles);
        setHasMore(hasMoreArticles);

        // Set category info from the first article
        if (result.data && result.data.length > 0 && currentPage === 1) {
          console.log("Setting category info:", result.data[0].category_name);
          setCategoryInfo({
            name: result.data[0].category_name || "",
          });
        }
      } catch (error) {
        console.error("Error in fetchArticles:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch articles"
        );
      } finally {
        console.log("Setting loading state to false");
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [categoryId, currentPage]);

  // Calculate total loaded articles
  const totalLoaded = articles.length;

  // Loading state display - only show on initial load
  if (isLoading && articles.length === 0) {
    return <CategoryArticlesSkeleton />;
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
          {categoryId
            ? "No articles found in this category."
            : "No articles found."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1536px] mx-auto px-4 mt-10">
      {/* Header Section */}
      <div className="mb-8">
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

      {/* Articles Grid */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Grid columns={5} gap="lg">
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
        </Grid>

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
  );
}
