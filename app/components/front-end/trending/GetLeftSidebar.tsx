"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import { Article } from "@/app/lib/definition";

export default function GetLeftSidebar() {
  const [featuredCount, setFeaturedCount] = useState(0);
  const [headlinesCount, setHeadlinesCount] = useState(0);
  const [trendingCount, setTrendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleCounts = async () => {
      try {
        const articles = await getArticles();

        // Count articles by type
        const featured = articles.filter(
          (article) => article.is_featured
        ).length;
        const headlines = articles.filter(
          (article) => article.is_headline
        ).length;
        const trending = articles.filter(
          (article) => article.is_trending
        ).length;

        setFeaturedCount(featured);
        setHeadlinesCount(headlines);
        setTrendingCount(trending);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch article counts"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleCounts();
  }, []);

  return {
    featuredCount,
    headlinesCount,
    trendingCount,
    isLoading,
    error,
  };
}
