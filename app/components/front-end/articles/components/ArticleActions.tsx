// Component Info
// Description: Article action buttons including back navigation.
// Date updated: 2025-November-21
// Author: thangtruong

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface ArticleActionsProps {
  showBackButton?: boolean;
}

export default function ArticleActions({
  showBackButton = true,
}: ArticleActionsProps) {
  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
      {/* Back button */}
      {showBackButton && (
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Articles
        </Link>
      )}
    </div>
  );
}
