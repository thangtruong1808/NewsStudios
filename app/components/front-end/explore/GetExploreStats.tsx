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

        let filteredArticles: Article[] = result;

        if (type === "trending") {
          filteredArticles = result.filter((article) => article.is_trending);
        } else if (tag) {
          filteredArticles = result.filter((article) =>
            article.tags?.some((t: { name: string }) => t.name === tag)
          );
        } else if (subcategory) {
          filteredArticles = result.filter(
            (article) => article.subcategory_id === parseInt(subcategory)
          );
        }

        const totalViews = filteredArticles.reduce(
          (sum, article) => sum + (article.views || 0),
          0
        );
        const totalLikes = filteredArticles.reduce(
          (sum, article) => sum + (article.likes || 0),
          0
        );
        const totalComments = filteredArticles.reduce(
          (sum, article) => sum + (article.comments?.length || 0),
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
