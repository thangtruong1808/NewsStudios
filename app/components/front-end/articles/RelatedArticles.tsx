"use client";

// Component to display related articles with optional current article filtering
import { useState, useEffect } from "react";
import { getRelativeArticles } from "@/app/lib/actions/relative-articles";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import Link from "next/link";
import Image from "next/image";
import {
  UserIcon,
  ClockIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

// Props interface for RelatedArticles component
interface RelatedArticlesProps {
  currentArticleId?: string; // Optional ID of current article to exclude from results
}

export default function RelatedArticles({
  currentArticleId,
}: RelatedArticlesProps) {
  // State management for articles, loading state, and error handling
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch and filter related articles on component mount or when currentArticleId changes
  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log(
          "Fetching related articles for article ID:",
          currentArticleId
        );

        const result = await getRelativeArticles(
          currentArticleId ? Number(currentArticleId) : undefined
        );

        if (result.error) {
          throw new Error(result.error);
        }

        console.log("Related articles result:", result);
        setRelatedArticles(result.data || []);
      } catch (error) {
        console.error("Error fetching related articles:", error);
        setError("Failed to load related articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [currentArticleId]);

  // Error state display
  if (error) {
    return (
      <section className="mb-16">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Main component render with loading state and article grid
  return (
    <>
      {/* Header section with title and description - Full width background */}
      <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Related Articles
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Discover more articles you might be interested in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <section className="mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : relatedArticles.length > 0 ? (
            // Grid layout for related articles with responsive columns
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArticles.map((article) => (
                // Article card with image, title, and metadata
                <Link
                  key={article.id}
                  href={`/article/${article.id}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                >
                  {article.image && (
                    <div className="relative aspect-video">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    {/* Category and Subcategory badges */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {article.category_name && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {article.category_name}
                        </span>
                      )}
                      {article.subcategory_name && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {article.subcategory_name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {/* Article content preview */}
                    {article.content && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {article.content}
                      </p>
                    )}
                    {/* Article metadata */}
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <HeartIcon className="h-4 w-4" />
                        {article.likes_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                        {article.comments_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <EyeIcon className="h-4 w-4" />
                        {article.views_count}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString()
                          : "No date"}
                      </span>
                      {article.author_name && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          {article.author_name}
                        </span>
                      )}
                    </div>
                    {/* Tags */}
                    {article.tag_names && article.tag_names.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {article.tag_names.map((tag, index) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{
                              backgroundColor: `${article.tag_colors?.[index]}20`,
                              color: article.tag_colors?.[index] || "#6B7280",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // Empty state display
            <div className="text-center py-8 text-gray-500">
              <p>No related articles found.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
