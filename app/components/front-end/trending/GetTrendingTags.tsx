"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getArticles } from "@/app/lib/actions/articles";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/shared/LoadingSpinner";

export default function GetTrendingTags() {
  const [trendingTags, setTrendingTags] = useState<
    { name: string; count: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingTags = async () => {
      try {
        const articles = await getArticles();
        if (articles) {
          // Count tag occurrences
          const tagCounts = articles.reduce(
            (acc: { [key: string]: number }, article) => {
              if (article.tag_names && Array.isArray(article.tag_names)) {
                article.tag_names.forEach((tag: string) => {
                  acc[tag] = (acc[tag] || 0) + 1;
                });
              }
              return acc;
            },
            {}
          );

          // Convert to array and sort by count
          const sortedTags = Object.entries(tagCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Get top 10 trending tags

          setTrendingTags(sortedTags);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch trending tags"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingTags();
  }, []);

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

  if (trendingTags.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No trending tags found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {trendingTags.map((tag) => (
        <Link
          key={tag.name}
          href={`/explore?tag=${encodeURIComponent(tag.name)}`}
          className="block p-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {tag.name}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {tag.count} articles
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
