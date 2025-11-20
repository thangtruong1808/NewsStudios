"use client";

// Component Info
// Description: Display dashboard statistics cards for users, likes, articles, and trending topics.
// Date updated: 2025-November-21
// Author: thangtruong

import {
  UserGroupIcon,
  DocumentTextIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  BookmarkIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

interface StatsCardsProps {
  stats: {
    activeUsers: number;
    activeUsersTrend: number;
    totalLikes: number;
    totalArticles: number;
    trendingTopics: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Active Users Card */}
      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Users</p>
            <p className="text-2xl font-bold mt-2 text-gray-900">{stats.activeUsers.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-2 flex items-center font-medium">
              <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1" />
              {stats.activeUsersTrend}% from last month
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl shadow-sm">
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Total Likes Card */}
      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Likes</p>
            <p className="text-2xl font-bold mt-2 text-gray-900">{stats.totalLikes.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center font-medium">
              <HandThumbUpIcon className="h-3.5 w-3.5 mr-1" />
              All articles
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl shadow-sm">
            <HandThumbUpIcon className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Articles Card */}
      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Articles</p>
            <p className="text-2xl font-bold mt-2 text-gray-900">{stats.totalArticles.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center font-medium">
              <BookmarkIcon className="h-3.5 w-3.5 mr-1" />
              Published
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl shadow-sm">
            <DocumentTextIcon className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Trending Topics Card */}
      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Trending Topics</p>
            <p className="text-2xl font-bold mt-2 text-gray-900">{stats.trendingTopics.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center font-medium">
              <FireIcon className="h-3.5 w-3.5 mr-1" />
              This week
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-xl shadow-sm">
            <FireIcon className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

