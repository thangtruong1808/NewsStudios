"use client";

import { useState, useEffect } from "react";
import { getFrontEndArticles } from "@/app/lib/actions/front-end-articles";
import { Article } from "@/app/lib/definition";
import { FireIcon } from "@heroicons/react/24/outline";
import { ImageCarousel } from "@/app/components/front-end/shared/ImageCarousel";
import Card from "@/app/components/front-end/shared/Card";
import ArticlesTrendingSkeleton from "./ArticlesTrendingSkeleton";

// Component Info
// Description: Present trending articles with hero carousel and grid plus pagination.
// Date created: 2024-12-19
// Author: thangtruong
export function ArticlesTrending() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const ITEMS_PER_PAGE = 10; // 5 columns × 2 rows

  // Fetch trending articles on component mount
  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getFrontEndArticles({
          type: "trending",
          page,
          itemsPerPage: ITEMS_PER_PAGE,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        const newArticles = result.data || [];
        setArticles((prev) => {
          const merged = page === 1 ? newArticles : [...prev, ...newArticles];
          const totalLoaded = merged.length;
          setHasMore(
            (result.totalCount || 0) > totalLoaded &&
              newArticles.length === ITEMS_PER_PAGE
          );
          return merged;
        });
      } catch (_error) {
        setError("Failed to load trending articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingArticles();
  }, [page]);

  // Handle load more click
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading) {
    return <ArticlesTrendingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <>
        {/* Header section with title and description */}
        <div className="w-screen bg-slate-50 relative left-1/2 right-1/2 -mx-[50vw] mb-8">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
            <div className="py-8">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 shadow-sm">
                  <FireIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Trending Articles</h2>
                  <p className="text-sm text-gray-600 mt-1">What&apos;s hot and happening right now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty state message */}
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
          <div className="max-w-[1536px] mx-auto px-6">
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                  <FireIcon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">No Trending Articles Right Now</h3>
                <p className="text-gray-500 max-w-md">
                  There are no trending articles at the moment. Check back later to see what&apos;s hot!
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const sortedCarouselArticles = [...articles]
    .sort(
      (a, b) =>
        new Date(b.published_at || "").getTime() -
        new Date(a.published_at || "").getTime()
    )
    .slice(0, 7);

  return (
    <>
      {/* Header section with title and description */}
      <div className="w-screen bg-slate-50 relative left-1/2 right-1/2 -mx-[50vw] mb-8">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 shadow-sm">
                <FireIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Trending Articles</h2>
                <p className="text-sm text-gray-600 mt-1">What&apos;s hot and happening right now</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      {/* Image Carousel Section */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="mb-4 h-[400px] w-full">
            <ImageCarousel
              images={sortedCarouselArticles.map((article) => article.image || "")}
              alt="Trending Articles"
              autoSlide
              slideInterval={5000}
              className="rounded-lg overflow-hidden"
              titles={sortedCarouselArticles.map((article) => article.title)}
              dates={sortedCarouselArticles.map(
                (article) => article.published_at || ""
              )}
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
            {articles.map((article) => (
              <Card
                key={article.id}
                title={article.title}
                description={article.content}
                imageUrl={article.image}
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
          </div>

          {/* Load More Button */}
          {hasMore && articles.length > 0 && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
