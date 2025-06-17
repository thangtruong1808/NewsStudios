"use client";

import { useState, useEffect } from "react";
import { getHighlightArticles } from "@/app/lib/actions/highlight-articles";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { StarIcon } from "@heroicons/react/24/outline";
import Grid from "@/app/components/front-end/shared/Grid";
import Card from "@/app/components/front-end/shared/Card";
import { ImageCarousel } from "@/app/components/front-end/shared/ImageCarousel";
import HighlightArticlesSkeleton from "./HighlightArticlesSkeleton";

// Component to display highlight articles in a grid layout
export default function HighlightArticles() {
  // State management for articles, loading state, and error handling
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 6; // 3 columns × 2 rows

  // Fetch highlight articles on component mount
  useEffect(() => {
    const fetchHighlightArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getHighlightArticles({
          page,
          itemsPerPage: ITEMS_PER_PAGE,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        const newArticles = result.data || [];
        if (page === 1) {
          setArticles(newArticles);
        } else {
          setArticles((prev) => [...prev, ...newArticles]);
        }
        setTotalCount(result.totalCount || 0);

        // Calculate total loaded articles
        const totalLoaded =
          page === 1
            ? newArticles.length
            : articles.length + newArticles.length;
        // Only show Load More if we have more articles to load and we received a full page
        setHasMore(
          result.totalCount > totalLoaded &&
          newArticles.length === ITEMS_PER_PAGE
        );
      } catch (error) {
        console.error("Error fetching highlight articles:", error);
        setError("Failed to load highlight articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlightArticles();
  }, [page]);

  // Handle load more click
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Loading state display
  if (isLoading) {
    return <HighlightArticlesSkeleton />;
  }

  // Error state display
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  // No articles found state
  if (articles.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No highlight articles found</p>
      </div>
    );
  }

  return (
    <>
      {/* Header section with title and description - Full width background */}
      <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto">
          <div className="py-8">
            <div className="flex items-center space-x-3 pl-4 lg:pl-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100">
                <StarIcon className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Highlight Articles
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Top stories that deserve your attention
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="max-w-[1536px] mx-auto px-4 py-8">
        {/* Image Carousel Section */}
        <div className="mb-4 h-[400px] w-full">
          <ImageCarousel
            images={articles
              .sort(
                (a, b) =>
                  new Date(b.published_at || "").getTime() -
                  new Date(a.published_at || "").getTime()
              )
              .slice(0, 7)
              .map((article) => article.image || "")}
            alt="Highlight Articles"
            autoSlide={true}
            slideInterval={5000}
            className="rounded-lg overflow-hidden"
            titles={articles
              .sort(
                (a, b) =>
                  new Date(b.published_at || "").getTime() -
                  new Date(a.published_at || "").getTime()
              )
              .slice(0, 7)
              .map((article) => article.title)}
            dates={articles
              .sort(
                (a, b) =>
                  new Date(b.published_at || "").getTime() -
                  new Date(a.published_at || "").getTime()
              )
              .slice(0, 7)
              .map((article) => article.published_at || "")}
          />
        </div>

        {/* Articles Grid */}
        <Grid columns={3} gap="lg">
          {articles.slice(0, page * ITEMS_PER_PAGE).map((article) => {
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
        </Grid>

        {/* Load More Button */}
        {hasMore && articles.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </>
  );
}
