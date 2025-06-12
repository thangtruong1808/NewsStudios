"use client";

import { useState, useEffect } from "react";
import { getHighlightArticles } from "@/app/lib/actions/highlight-articles";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { StarIcon, UserIcon, CalendarIcon } from "@heroicons/react/24/outline";

// Component to display highlight articles in a grid layout
export default function HighlightArticles() {
  // State management for articles, loading state, and error handling
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch highlight articles on component mount
  const fetchHighlightArticles = async () => {
    try {
      setLoading(true);
      const result = await getHighlightArticles();

      if (result.error) {
        throw new Error(result.error);
      }

      setArticles(result.data || []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch highlight articles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlightArticles();
  }, []);

  // Loading state display
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state display
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  // No articles found state
  if (articles.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No highlight articles found</p>
      </div>
    );
  }

  return (
    <>
      {/* Header section with title and description - Full width background */}
      <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100">
                <StarIcon className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Highlight Articles
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Top stories that deserve your attention
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="space-y-8 mt-8">
        {/* Grid layout for highlight articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Article image */}
              <div className="relative h-48">
                <img
                  src={article.image || "/placeholder-image.jpg"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article content */}
              <div className="p-4">
                {/* Category and subcategory badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.category_name && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-500">
                        Category:
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {article.category_name}
                      </span>
                    </div>
                  )}
                  {article.subcategory_name && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-500">
                        Subcategory:
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        {article.subcategory_name}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.content}
                </p>

                {/* Article metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    {/* Views count */}
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {article.views_count}
                    </div>
                    {/* Likes count */}
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {article.likes_count}
                    </div>
                    {/* Comments count */}
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {article.comments_count}
                    </div>
                  </div>
                  {/* Author information */}
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-1" />
                    {article.author_name}
                  </div>
                </div>

                {/* Article date */}
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "No date available"}
                </div>

                {/* Tags section */}
                {article.tag_names && article.tag_names.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-medium text-gray-500 mb-2 block">
                      Tags:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {article.tag_names.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium text-white rounded"
                          style={{
                            backgroundColor:
                              article.tag_colors?.[index] || "#6B7280",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
