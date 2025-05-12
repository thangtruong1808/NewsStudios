"use client";

import Link from "next/link";
import { StarIcon, NewspaperIcon, FireIcon } from "@heroicons/react/24/outline";
import GetLeftSidebar from "./trending/GetLeftSidebar";
import { LoadingSpinner } from "@/app/components/shared/LoadingSpinner";

export default function QuickLinks() {
  const { featuredCount, headlinesCount, trendingCount, isLoading, error } =
    GetLeftSidebar();

  if (isLoading) {
    return (
      <div className="hidden lg:block w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 p-4 text-white rounded-lg">
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hidden lg:block w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 p-4 text-white rounded-lg">
        <div className="text-red-200 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 p-4 text-white rounded-lg">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Quick Links</h2>
        <nav className="space-y-2">
          <Link
            href="/featured"
            className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <StarIcon className="h-5 w-5" />
              Featured Articles
            </div>
            <span className="text-sm bg-indigo-600 px-2 py-0.5 rounded-full">
              {featuredCount}
            </span>
          </Link>
          <Link
            href="/headlines"
            className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <NewspaperIcon className="h-5 w-5" />
              Headlines Articles
            </div>
            <span className="text-sm bg-indigo-600 px-2 py-0.5 rounded-full">
              {headlinesCount}
            </span>
          </Link>
          <Link
            href="/trending"
            className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <FireIcon className="h-5 w-5" />
              Trending Articles
            </div>
            <span className="text-sm bg-indigo-600 px-2 py-0.5 rounded-full">
              {trendingCount}
            </span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
