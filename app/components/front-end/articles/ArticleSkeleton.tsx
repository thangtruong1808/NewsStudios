"use client";

import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

export default function ArticleSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Header Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="animate-pulse">
          {/* Title */}
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          
          {/* Metadata */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>

          {/* Featured Image */}
          <div className="w-full h-[400px] bg-gray-200 rounded-lg mb-6" />

          {/* Content */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded-full w-20" />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <div className="flex space-x-4">
              <div className="h-8 bg-gray-200 rounded w-24" />
              <div className="h-8 bg-gray-200 rounded w-24" />
              <div className="h-8 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>

      {/* Comments Section Skeleton */}
      <section className="mb-16">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <ChatBubbleLeftIcon className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
          </div>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 