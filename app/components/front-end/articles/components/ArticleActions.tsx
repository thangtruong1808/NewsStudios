import { ArrowLeftIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface ArticleActionsProps {
  showBackButton?: boolean;
  isBookmarked?: boolean;
  onBookmark?: () => void;
}

export default function ArticleActions({
  showBackButton = true,
  isBookmarked = false,
  onBookmark,
}: ArticleActionsProps) {
  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
      {showBackButton && (
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Articles
        </Link>
      )}

      {onBookmark && (
        <button
          onClick={onBookmark}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            isBookmarked
              ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <BookmarkIcon className="w-4 h-4 mr-2" />
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </button>
      )}
    </div>
  );
}
