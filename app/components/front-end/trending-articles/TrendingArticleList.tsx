"use client";

import { Article } from "@/app/lib/definition";
import Link from "next/link";
import Image from "next/image";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface TrendingArticleListProps {
  articles: Article[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TrendingArticleList = ({
  articles,
  currentPage,
  totalPages,
  onPageChange,
}: TrendingArticleListProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            href={`/articles/${article.id}`}
            key={article.id}
            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative h-48">
              <Image
                src={article.image || "/images/placeholder.jpg"}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                {article.content}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <HeartIcon className="h-4 w-4 mr-1" />
                    <span>{article.likes_count}</span>
                  </div>
                  <div className="flex items-center">
                    <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                    <span>{article.comments_count}</span>
                  </div>
                  <div className="flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    <span>{article.views_count}</span>
                  </div>
                </div>
                <span>
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
