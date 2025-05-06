"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import { Article } from "@/app/lib/definition";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components/shared/LoadingSpinner";
import { FireIcon } from "@heroicons/react/24/solid";
import { NewspaperIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const result = await getArticles();
        if (result) {
          // Sort articles: trending first, then by published date
          const sortedArticles = [...result].sort((a, b) => {
            // First sort by trending status
            if (a.is_trending && !b.is_trending) return -1;
            if (!a.is_trending && b.is_trending) return 1;

            // If trending status is the same, sort by published date
            return (
              new Date(b.published_at).getTime() -
              new Date(a.published_at).getTime()
            );
          });

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

  const totalPages = Math.ceil(articles.length / itemsPerPage);

  // Get current page articles
  const paginatedArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Separate trending and regular articles
  const trendingArticles = paginatedArticles.filter(
    (article) => article.is_trending
  );
  const regularArticles = paginatedArticles.filter(
    (article) => !article.is_trending
  );

  return (
    <div className="space-y-8">
      {/* Featured/Trending Articles */}
      {trendingArticles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FireIcon className="h-6 w-6 text-orange-500" />
            Trending Now
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="group block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  {article.video ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircleIcon className="h-16 w-16 text-white opacity-80" />
                      </div>
                      <Image
                        src={article.image || "/video-thumbnail.jpg"}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          <PlayCircleIcon className="h-4 w-4 mr-1" />
                          Video
                        </span>
                      </div>
                    </div>
                  ) : article.image ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={true}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <div className="text-orange-600 text-4xl font-bold">
                        {article.title.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  {article.is_trending && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        <FireIcon className="h-4 w-4 mr-1" />
                        Trending
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-gray-600 line-clamp-2">
                    {article.content}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {article.published_at instanceof Date
                        ? article.published_at.toLocaleDateString()
                        : new Date(
                            article.published_at || ""
                          ).toLocaleDateString()}
                    </span>
                    {article.category_name && (
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                        {article.category_name}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Regular Articles */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <NewspaperIcon className="h-6 w-6 text-indigo-500" />
          Latest Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="group block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {article.video ? (
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircleIcon className="h-16 w-16 text-white opacity-80" />
                  </div>
                  <Image
                    src={article.image || "/video-thumbnail.jpg"}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <PlayCircleIcon className="h-4 w-4 mr-1" />
                      Video
                    </span>
                  </div>
                </div>
              ) : article.image ? (
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="relative aspect-[16/9] bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                  <div className="text-indigo-600 text-4xl font-bold">
                    {article.title.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {article.content}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {article.published_at instanceof Date
                      ? article.published_at.toLocaleDateString()
                      : new Date(
                          article.published_at || ""
                        ).toLocaleDateString()}
                  </span>
                  {article.category_name && (
                    <span className="px-2 py-1 bg-gray-100 rounded-full">
                      {article.category_name}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
}
