"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import { Article } from "@/app/lib/definition";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components/shared/LoadingSpinner";
import {
  PlayCircleIcon,
  TagIcon,
  CalendarIcon,
  FolderIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

type Props = {
  type?: "trending";
  tag?: string;
  subcategory?: string;
};

export default function SubcategoryArticles({ type, tag, subcategory }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Changed to 2 to show one article per column

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const result = await getArticles({
          type,
          tag,
          subcategoryId: subcategory,
        });
        if (result) {
          setArticles(result);
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
  }, [type, tag, subcategory]);

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

  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {type === "trending"
            ? "No trending articles found."
            : tag
            ? `No articles found with tag "${tag}".`
            : subcategory
            ? "No articles found in this subcategory."
            : "No articles found."}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full max-w-[1024px] mx-auto mt-10">
      {/* Articles Grid - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedArticles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Photo Section - Side by side on desktop */}
              <div className="relative w-full md:w-1/2 aspect-[16/9] md:aspect-auto bg-gray-100">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : article.video ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600">
                    <PlayCircleIcon className="h-16 w-16 text-white opacity-80" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600">
                    <span className="text-4xl font-bold text-white">
                      {article.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section - Side by side on desktop */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {article.content}
                  </p>
                  {/* Date Row */}
                  <div className="mt-3">
                    <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                      <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                      {article.published_at instanceof Date
                        ? article.published_at.toLocaleDateString()
                        : new Date(
                            article.published_at || ""
                          ).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Tags Row */}
                  {article.tag_names && article.tag_names.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {article.tag_names.map((tagName) => (
                        <Link
                          key={tagName}
                          href={`/explore?tag=${encodeURIComponent(tagName)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium transition-colors duration-200"
                        >
                          <TagIcon className="h-3.5 w-3.5 text-gray-500" />
                          {tagName}
                        </Link>
                      ))}
                    </div>
                  )}
                  {/* Category and Subcategory Row */}
                  <div className="mt-2 flex items-center gap-2">
                    {article.category_name && (
                      <span className="px-2 py-1 bg-gray-100 rounded-full flex items-center gap-1 text-xs text-gray-700">
                        <FolderIcon className="h-3.5 w-3.5 text-gray-500" />
                        {article.category_name}
                      </span>
                    )}
                    {article.sub_category_name && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full flex items-center gap-1 text-xs">
                        <BookmarkIcon className="h-3.5 w-3.5" />
                        {article.sub_category_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
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
