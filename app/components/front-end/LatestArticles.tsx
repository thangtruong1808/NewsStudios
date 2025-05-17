"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import { Article } from "@/app/lib/definition";
import Link from "next/link";
import Image from "next/image";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { ArticleMetadata } from "./latest-articles/ArticleMetadata";
import { ArticleInfo } from "./latest-articles/ArticleInfo";

export default function LatestArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const result = await getArticles();
        const articleData = result.data || [];

        // Group articles by subcategory and category
        const groupedArticles = articleData.reduce(
          (acc: Record<string, Article[]>, article: Article) => {
            const key =
              article.sub_category_name ||
              article.category_name ||
              "uncategorized";
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(article);
            return acc;
          },
          {} as Record<string, Article[]>
        );

        // Sort each group by priority and published date
        const sortedGroups = (
          Object.values(groupedArticles) as Article[][]
        ).map((group) =>
          group.sort((a, b) => {
            // First sort by headline_priority
            if (a.headline_priority !== b.headline_priority) {
              return (b.headline_priority || 0) - (a.headline_priority || 0);
            }
            // Then by published date
            const dateA = a.published_at
              ? new Date(a.published_at).getTime()
              : 0;
            const dateB = b.published_at
              ? new Date(b.published_at).getTime()
              : 0;
            return dateB - dateA;
          })
        );

        // Take the first article from each group
        const prioritizedArticles = sortedGroups.map((group) => group[0]);

        // Sort the final list by published date
        const finalArticles = prioritizedArticles.sort((a, b) => {
          const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
          const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
          return dateB - dateA;
        });

        setArticles(finalArticles);
        setDisplayedArticles(finalArticles.slice(0, articlesPerPage));
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

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const nextArticles = articles.slice(0, nextPage * articlesPerPage);
    setDisplayedArticles(nextArticles);
    setCurrentPage(nextPage);
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col">
              {/* Image Section */}
              <div className="w-full">
                <Link href={`/article/${article.id}`} className="block group">
                  <div className="relative aspect-[16/9]">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <div className="text-orange-600 text-3xl font-bold">
                          {article.title.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </div>

              {/* Content Section */}
              <div className="w-full p-3">
                <Link href={`/article/${article.id}`} className="block group">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mt-1 text-sm">
                    {article.content}
                  </p>
                </Link>
                <div className="mt-2 flex flex-wrap gap-1">
                  <ArticleMetadata article={article} />
                  <ArticleInfo article={article} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {displayedArticles.length < articles.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
