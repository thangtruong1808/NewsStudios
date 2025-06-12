"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  StarIcon,
  NewspaperIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { QuickLinksSkeleton } from "./QuickLinksSkeleton";

export const QuickLinks = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return <QuickLinksSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Featured Articles - Curated selection of the most important and high-quality content */}
        <button
          onClick={() => handleNavigation("/featured")}
          className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-orange-400 group"
        >
          <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-300">
            <StarIcon className="h-6 w-6 text-orange-500 group-hover:text-orange-600" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-medium text-gray-700 group-hover:text-orange-600">
              Featured
            </span>
            <span className="block text-xs text-gray-500">Editor's Choice</span>
            <span className="block text-xs text-gray-400 mt-1">
              Curated selection of the most important and high-quality content
            </span>
          </div>
        </button>

        {/* Headlines - Breaking news and latest updates from all categories */}
        <button
          onClick={() => handleNavigation("/headlines")}
          className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-orange-400 group"
        >
          <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-300">
            <NewspaperIcon className="h-6 w-6 text-orange-500 group-hover:text-orange-600" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-medium text-gray-700 group-hover:text-orange-600">
              Headlines
            </span>
            <span className="block text-xs text-gray-500">Breaking News</span>
            <span className="block text-xs text-gray-400 mt-1">
              Latest updates and breaking news from all categories
            </span>
          </div>
        </button>

        {/* Trending - Most popular and widely discussed articles */}
        <button
          onClick={() => handleNavigation("/trending")}
          className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-orange-400 group"
        >
          <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-300">
            <ArrowTrendingUpIcon className="h-6 w-6 text-orange-500 group-hover:text-orange-600" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-medium text-gray-700 group-hover:text-orange-600">
              Trending
            </span>
            <span className="block text-xs text-gray-500">Most Popular</span>
            <span className="block text-xs text-gray-400 mt-1">
              Most popular and widely discussed articles
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
