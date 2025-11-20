"use client";

// Component Info
// Description: Display trending articles list with likes, comments, and publication dates.
// Date updated: 2025-November-21
// Author: thangtruong

import { FireIcon, HandThumbUpIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface TrendingArticle {
  id: number;
  title: string;
  likes_count: number;
  comments_count: number;
  published_at: string;
}

interface TrendingArticlesSectionProps {
  trendingArticles: TrendingArticle[];
  formatDate: (_dateString: string) => string;
}

export default function TrendingArticlesSection({
  trendingArticles,
  formatDate,
}: TrendingArticlesSectionProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-5 border border-gray-100">
      {/* Section Header */}
      <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
        <FireIcon className="h-6 w-6 text-orange-500 mr-2" />
        Trending Now
      </h2>
      {/* Articles List */}
      <div className="space-y-3">
        {trendingArticles.length > 0 ? (
          trendingArticles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl hover:from-blue-100 hover:to-blue-50 transition-all duration-200 border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md"
            >
              <div className="flex-1">
                {/* Article Title */}
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2">{article.title}</h3>
                {/* Article Meta Info */}
                <p className="text-xs text-gray-600 flex items-center gap-3">
                  {/* Likes Count */}
                  <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full">
                    <HandThumbUpIcon className="h-3.5 w-3.5 text-purple-600" />
                    <span className="font-medium">{article.likes_count.toLocaleString()}</span>
                  </span>
                  {/* Comments Count */}
                  <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full">
                    <ChatBubbleLeftIcon className="h-3.5 w-3.5 text-blue-600" />
                    <span className="font-medium">{article.comments_count.toLocaleString()}</span>
                  </span>
                  {/* Publication Date */}
                  <span className="text-gray-400">• {formatDate(article.published_at)}</span>
                </p>
              </div>
            </Link>
          ))
        ) : (
          /* Empty State */
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-center">
              <p className="font-medium text-sm text-gray-500">No trending articles at the moment</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

