"use client";

// Component to display articles filtered by subcategory in a 5x5 grid layout
import { useState, useEffect, useRef } from "react";
import { getSubcategoryArticles } from "@/app/lib/actions/front-end-articles";
import { getSubcategoryById } from "@/app/lib/actions/subcategories";
import { getCategoryById } from "@/app/lib/actions/categories";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import Grid from "@/app/components/front-end/shared/Grid";
import Card from "@/app/components/front-end/shared/Card";
import { FolderIcon } from "@heroicons/react/24/outline";
import SubcategoryArticlesSkeleton from "./SubcategoryArticlesSkeleton";

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
  const itemsPerPage = 10; // Use same itemsPerPage for both initial load and load more
  const [hasMore, setHasMore] = useState(false);
  const articlesRef = useRef<Article[]>([]);

  // Handle load more click
  const handleLoadMore = () => {
    if (isLoading) return;
    setCurrentPage((prev) => prev + 1);
  };

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

        const newArticles = result.data || [];

        if (currentPage === 1) {
          // For page 1, just set the articles directly
          setArticles(newArticles);
          articlesRef.current = newArticles;
        } else {
          // For page 2+, append the new articles
          const updatedArticles = [...articlesRef.current, ...newArticles];
          articlesRef.current = updatedArticles;
          setArticles(updatedArticles);
        }

        setTotalCount(result.totalCount || 0);

        // Calculate total loaded articles
        const totalLoaded = articlesRef.current.length;
        // Only show Load More if we have more articles to load
        setHasMore(result.totalCount > totalLoaded);

        // Set subcategory info from the first article
        if (result.data && result.data.length > 0 && currentPage === 1) {
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

  // Fetch subcategory and category information
  useEffect(() => {
    const fetchSubcategoryInfo = async () => {
      if (!subcategory) return;

      try {
        const subcategoryResult = await getSubcategoryById(parseInt(subcategory));
        if (subcategoryResult.data) {
          const categoryResult = await getCategoryById(subcategoryResult.data.category_id);
          setSubcategoryInfo({
            name: subcategoryResult.data.name,
            category_name: categoryResult.data?.name || "Unknown Category"
          });
        }
      } catch (error) {
        console.error("Error fetching subcategory info:", error);
      }
    };

    fetchSubcategoryInfo();
  }, [subcategory]);

  // Loading state display
  if (isLoading) {
    return <SubcategoryArticlesSkeleton />;
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
                  {subcategoryInfo?.name || subcategory || "Articles"}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <FolderIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Category:
                    </span>
                    <span className="text-sm text-gray-600">
                      {subcategoryInfo?.category_name || "Loading..."}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FolderIcon className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Subcategory:
                    </span>
                    <span className="text-sm text-indigo-600">
                      {subcategoryInfo?.name || subcategory || "Loading..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State Message */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              No Articles Found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md">
              {subcategory
                ? `We couldn't find any articles in the subcategory "${subcategoryInfo?.name || subcategory}" under category "${subcategoryInfo?.category_name || 'Loading...'}". Please check back later or explore other categories.`
                : "No articles are available at the moment. Please check back later."}
            </p>
          </div>
        </div>
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
                {subcategoryInfo?.name ?? "Articles"}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <FolderIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Category:
                  </span>
                  <span className="text-sm text-gray-600">
                    {subcategoryInfo?.category_name ?? "Uncategorized"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FolderIcon className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Subcategory:
                  </span>
                  <span className="text-sm text-indigo-600">
                    {subcategoryInfo?.name ?? "All"}
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
