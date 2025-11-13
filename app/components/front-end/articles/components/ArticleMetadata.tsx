import type { Article } from "@/app/lib/definition";
import {
  CalendarIcon,
  UserIcon,
  FolderIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

interface ArticleMetadataProps {
  article: Article;
}

// Description: Present article metadata badges including author, categories, and engagement stats.
// Data created: 2024-11-13
// Author: thangtruong
export default function ArticleMetadata({ article }: ArticleMetadataProps) {
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
      {/* Engagement stats */}
      <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
        <EyeIcon className="h-4 w-4 text-gray-400" />
        <span>{article.views_count} views</span>
      </div>
      <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
        <HeartIcon className="h-4 w-4 text-gray-400" />
        <span>{article.likes_count} likes</span>
      </div>
      <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
        <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400" />
        <span>{article.comments_count} comments</span>
      </div>
    </div>
  );
}
