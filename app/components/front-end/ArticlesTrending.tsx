"use client";

import { useState, useEffect, useCallback } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/shared/LoadingSpinner";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { TrendingImageCarousel } from "./trending/TrendingImageCarousel";
import { TrendingArticleList } from "./trending/TrendingArticleList";

export default function ArticlesTrending() {
  const [trendingImages, setTrendingImages] = useState<Article[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const displayCount = 3;

  const fetchTrendingArticles = useCallback(async (page: number) => {
    try {
      const result = await getArticles();
      if (result) {
        const allTrendingArticles = result.filter(
          (article) => article.is_trending
        );
        setTrendingImages(allTrendingArticles);

        const total = Math.max(
          1,
          allTrendingArticles.length - displayCount + 1
        );
        setTotalPages(total);

        const startIndex = page - 1;
        const endIndex = startIndex + displayCount;
        const displayArticles = allTrendingArticles.slice(startIndex, endIndex);

        setTrendingArticles(displayArticles);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch articles"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingArticles(currentPage);
  }, [currentPage, fetchTrendingArticles]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <ArrowTrendingUpIcon className="h-7 w-7 text-orange-500" />
        Trending Articles
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrendingImageCarousel articles={trendingImages} />
        <TrendingArticleList
          articles={trendingArticles}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
