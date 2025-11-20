"use client";

// Component Info
// Description: Display quick action buttons for common dashboard tasks.
// Date updated: 2025-November-21
// Author: thangtruong

import { FolderIcon, TagIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function QuickActionsSection() {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      {/* Section Header */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Create Article Button */}
        <Link
          href="/dashboard/articles/create"
          className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 text-sm font-semibold text-center border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
        >
          New Article
        </Link>
        {/* View Articles Button */}
        <Link
          href="/dashboard/articles"
          className="p-4 bg-gradient-to-br from-green-50 to-green-100 text-green-700 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200 text-sm font-semibold text-center border border-green-200 hover:border-green-300 shadow-sm hover:shadow-md"
        >
          Articles
        </Link>
        {/* Categories Button */}
        <Link
          href="/dashboard/categories"
          className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 text-sm font-semibold text-center flex items-center justify-center gap-2 border border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md"
        >
          <FolderIcon className="h-4 w-4" />
          Categories
        </Link>
        {/* Tags Button */}
        <Link
          href="/dashboard/tags"
          className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-200 text-sm font-semibold text-center flex items-center justify-center gap-2 border border-orange-200 hover:border-orange-300 shadow-sm hover:shadow-md"
        >
          <TagIcon className="h-4 w-4" />
          Tags
        </Link>
      </div>
    </div>
  );
}

