"use client";

// Component Info
// Description: Display quick statistics including comments, most liked article, and user counts.
// Date created: 2025-01-27
// Author: thangtruong

import { ChatBubbleLeftIcon, HandThumbUpIcon, UserGroupIcon } from "@heroicons/react/24/outline";

interface QuickStatsSectionProps {
  stats: {
    totalComments: number;
    activeUsers: number;
    inactiveUsers: number;
    mostLikedArticle?: {
      id: number;
      title: string;
      likes_count: number;
    };
  };
}

export default function QuickStatsSection({ stats }: QuickStatsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      {/* Section Header */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Stats</h2>
      {/* Stats List */}
      <div className="space-y-3">
        {/* Comments Count */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl border border-blue-100 hover:border-blue-200 transition-colors">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <ChatBubbleLeftIcon className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Comments</span>
          </div>
          <span className="text-base font-bold text-gray-900">{stats.totalComments.toLocaleString()}</span>
        </div>
        {/* Most Liked Article */}
        {stats.mostLikedArticle ? (
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-50 rounded-xl border border-purple-100 hover:border-purple-200 transition-colors">
            <div className="flex items-center flex-1 min-w-0">
              <div className="bg-purple-100 p-2 rounded-lg mr-3 flex-shrink-0">
                <HandThumbUpIcon className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 line-clamp-1 truncate">
                {stats.mostLikedArticle.title}
              </span>
            </div>
            <span className="text-base font-bold text-gray-900 ml-2 flex-shrink-0">
              {stats.mostLikedArticle.likes_count.toLocaleString()}
            </span>
          </div>
        ) : (
          /* Empty State for Most Liked Article */
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <HandThumbUpIcon className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Most Liked Article</span>
            </div>
            <span className="text-base font-bold text-gray-400">-</span>
          </div>
        )}
        {/* User Counts */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-50 rounded-xl border border-green-100 hover:border-green-200 transition-colors">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <UserGroupIcon className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">New Users</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-base font-bold text-green-600">
              {stats.activeUsers.toLocaleString()} active
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {stats.inactiveUsers.toLocaleString()} inactive
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

