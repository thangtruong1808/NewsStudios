"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import { Article } from "@/app/lib/definition";

interface GetExploreStatsProps {
  type?: "trending";
  tag?: string;
  subcategory?: string;
}

interface Stats {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export default function GetExploreStats({
  type,
  tag,
  subcategory,
}: GetExploreStatsProps) {
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const result = await getArticles();

        if (!result) {
          throw new Error("Failed to fetch articles");
        }

        if (!result.data) {
          return [];
        }

        let filteredArticles: Article[] = result.data;

        if (type === "trending") {
          filteredArticles = result.data.filter((article) => article.is_trending);
        } else if (tag) {
          filteredArticles = result.data.filter((article) =>
            article.tag_names?.includes(tag)
          );
        } else if (subcategory) {
          filteredArticles = result.data.filter(
            (article) => article.sub_category_id === parseInt(subcategory)
          );
        }

        // Get the most viewed article
        const mostViewed = [...filteredArticles].sort(
          (a, b) => b.views_count - a.views_count
        )[0];

        // Get the most liked article
        const mostLiked = [...filteredArticles].sort(
          (a, b) => b.likes_count - a.likes_count
        )[0];

        // Get the most commented article
        const mostCommented = [...filteredArticles].sort(
          (a, b) => b.comments_count - a.comments_count
        )[0];

        const totalViews = filteredArticles.reduce(
          (sum, article) => sum + article.views_count,
          0
        );
        const totalLikes = filteredArticles.reduce(
          (sum, article) => sum + article.likes_count,
          0
        );
        const totalComments = filteredArticles.reduce(
          (sum, article) => sum + article.comments_count,
          0
        );

        setStats({
          totalArticles: filteredArticles.length,
          totalViews,
          totalLikes,
          totalComments,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch stats"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [type, tag, subcategory]);

  return { stats, isLoading, error };
}
