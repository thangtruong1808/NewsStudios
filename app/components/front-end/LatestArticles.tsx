"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import { Article } from "@/app/lib/definition";
import Link from "next/link";
import Image from "next/image";
import { LoadingSpinner } from "@/app/components/shared/LoadingSpinner";
import { ArticleMetadata } from "./latest-articles/ArticleMetadata";
import { ArticleInfo } from "./latest-articles/ArticleInfo";

export default function LatestArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const result = await getArticles();
        if (result) {
          // Sort articles by published date (newest first)
          const sortedArticles = [...result].sort(
            (a, b) =>
              new Date(b.published_at).getTime() -
              new Date(a.published_at).getTime()
          );
          setArticles(sortedArticles);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch articles"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
      <div className="space-y-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="block group"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4">
              {/* Image Section */}
              <div className="relative aspect-[16/9] md:h-full">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <div className="text-orange-600 text-4xl font-bold">
                      {article.title.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 mt-2">
                    {article.content}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <ArticleMetadata article={article} />
                  <ArticleInfo article={article} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
