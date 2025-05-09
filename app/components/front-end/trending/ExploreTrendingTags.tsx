"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import Link from "next/link";
import { TagIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "../../shared/LoadingSpinner";
import { Article } from "@/app/lib/definition";

export default function ExploreTrendingTags() {
  const [tags, setTags] = useState<Array<{ name: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const result = await getArticles();

        if (!result) {
          throw new Error("Failed to fetch articles");
        }

        // Count occurrences of each tag
        const tagCounts = new Map<string, number>();

        result.forEach((article: Article) => {
          // Use tag_names array from the article
          if (article.tag_names && article.tag_names.length > 0) {
            article.tag_names.forEach((tagName: string) => {
              const count = tagCounts.get(tagName) || 0;
              tagCounts.set(tagName, count + 1);
            });
          }
        });

        // Convert to array and sort by count
        const sortedTags = Array.from(tagCounts.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6); // Get top 6 tags

        console.log("Sorted tags:", sortedTags); // Debug log
        setTags(sortedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch tags"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-xl">
        <p className="text-red-700 text-center">{error}</p>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No trending tags found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/explore?tag=${encodeURIComponent(tag.name)}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors duration-200"
        >
          <TagIcon className="h-5 w-5" />
          <span className="font-medium">{tag.name}</span>
          <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-sm font-medium bg-white rounded-full">
            {tag.count}
          </span>
        </Link>
      ))}
    </div>
  );
}
