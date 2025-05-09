"use client";

import Link from "next/link";
import { StarIcon, NewspaperIcon, FireIcon } from "@heroicons/react/24/outline";
import GetLeftSidebar from "../trending/GetLeftSidebar";

export default function ExploreQuickLinks() {
  const { featuredCount, headlinesCount, trendingCount } = GetLeftSidebar();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
      <div className="flex flex-wrap justify-around gap-3">
        <Link
          href="/featured"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium transition-colors duration-200"
        >
          <StarIcon className="h-4 w-4" />
          <span>Featured</span>
          <span className="text-xs bg-indigo-200 px-2 py-0.5 rounded-full">
            {featuredCount}
          </span>
        </Link>
        <Link
          href="/headlines"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium transition-colors duration-200"
        >
          <NewspaperIcon className="h-4 w-4" />
          <span>Headlines</span>
          <span className="text-xs bg-indigo-200 px-2 py-0.5 rounded-full">
            {headlinesCount}
          </span>
        </Link>
        <Link
          href="/trending"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium transition-colors duration-200"
        >
          <FireIcon className="h-4 w-4" />
          <span>Trending</span>
          <span className="text-xs bg-indigo-200 px-2 py-0.5 rounded-full">
            {trendingCount}
          </span>
        </Link>
      </div>
    </div>
  );
}
