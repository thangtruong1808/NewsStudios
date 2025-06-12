"use client";

import { useState, useEffect } from "react";
import { getFrontEndArticles } from "@/app/lib/actions/front-end-articles";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { ArrowTrendingUpIcon, FireIcon } from "@heroicons/react/24/outline";
import { TrendingImageCarousel } from "@/app/components/front-end/trending-articles/TrendingImageCarousel";
import { TrendingArticleList } from "@/app/components/front-end/trending-articles/TrendingArticleList";

export const ArticlesTrending = () => {
  const [trendingImages, setTrendingImages] = useState<Article[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const displayCount = 6;

  const fetchTrendingArticles = async () => {
    try {
      setLoading(true);
      const result = await getFrontEndArticles({ type: "trending" });

      if (result.error) {
        throw new Error(result.error);
      }

      const articles = result.data || [];
      setTrendingImages(articles);

      const totalPages = Math.ceil(articles.length / displayCount);
      const startIndex = (currentPage - 1) * displayCount;
      const endIndex = startIndex + displayCount;
      setTrendingArticles(articles.slice(startIndex, endIndex));

      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch trending articles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingArticles();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  if (trendingArticles.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No trending articles found</p>
      </div>
    );
  }

  return (
    <>
      {/* Header section with title and description - Full width background */}
      <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100">
                <FireIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Trending Articles
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  What's hot and happening right now
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="space-y-8 mt-8">
        <TrendingImageCarousel articles={trendingImages} />

        <TrendingArticleList
          articles={trendingArticles}
          currentPage={currentPage}
          totalPages={Math.ceil(trendingImages.length / displayCount)}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};
