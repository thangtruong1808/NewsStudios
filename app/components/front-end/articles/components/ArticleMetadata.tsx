"use client";

import type { Article } from "@/app/lib/definition";
import {
  CalendarIcon,
  UserIcon,
  FolderIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import LikeButton from "./LikeButton";

// Component Info
// Description: Present article metadata badges including author, categories, and engagement stats with real-time comment count.
// Date updated: 2025-November-21
// Author: thangtruong

interface ArticleMetadataProps {
  article: Article;
  commentsCount?: number | null; // Optional dynamic comment count for real-time updates
}

export default function ArticleMetadata({ article, commentsCount }: ArticleMetadataProps) {
  // Use dynamic comment count if provided, otherwise fall back to article's initial count
  const displayCommentsCount = commentsCount !== null && commentsCount !== undefined ? commentsCount : article.comments_count;

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
      {/* Publication date */}
      <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
        <CalendarIcon className="h-4 w-4 text-gray-400" />
        <span>{new Date(article.published_at).toLocaleDateString()}</span>
      </div>
      {/* Author information */}
      <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
        <UserIcon className="h-4 w-4 text-gray-400" />
        <span>{article.author_name}</span>
      </div>
      {article.category_name && (
        /* Category badge */
        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
          <FolderIcon className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-700">Category:</span>
          <span>{article.category_name}</span>
        </div>
      )}
      {article.subcategory_name && (
        /* Subcategory badge */
        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
          <FolderIcon className="h-4 w-4 text-indigo-400" />
          <span className="font-medium text-gray-700">Subcategory:</span>
          <span className="text-indigo-600">{article.subcategory_name}</span>
        </div>
      )}
      {/* Like button with interactive functionality */}
      <LikeButton articleId={article.id} initialLikesCount={article.likes_count} />
      {/* Comments count badge */}
      <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
        <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400" />
        <span>{displayCommentsCount} comments</span>
      </div>
    </div>
  );
}
