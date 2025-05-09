"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import Link from "next/link";
import { TagIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "@/app/components/shared/LoadingSpinner";

export default function ExploreTrendingTags() {
  const [trendingTags, setTrendingTags] = useState<
    { name: string; count: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingTags = async () => {
      try {
        const articles = await getArticles();
        const tagCounts: { [key: string]: number } = {};

        // Count tag occurrences
        articles.forEach((article) => {
          article.tag_names.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        });

        // Convert to array and sort by count
        const sortedTags = Object.entries(tagCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setTrendingTags(sortedTags);
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
    <div className="flex flex-wrap justify-around gap-3">
      {trendingTags.map((tag) => (
        <Link
          key={tag.name}
          href={`/explore?tag=${encodeURIComponent(tag.name)}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium transition-colors duration-200"
        >
          <TagIcon className="h-4 w-4" />
          <span>{tag.name}</span>
          <span className="text-xs bg-indigo-200 px-2 py-0.5 rounded-full">
            {tag.count}
          </span>
        </Link>
      ))}
    </div>
  );
}
