"use client";

// Component Info
// Description: Enhanced dashboard component displaying real-time statistics, trending articles, and recent activity from database.
// Date created: 2025-01-27
// Author: thangtruong

import {
  UserGroupIcon,
  DocumentTextIcon,
  FireIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  ArrowTrendingUpIcon,
  BookmarkIcon,
  HandThumbUpIcon,
  TagIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import CategorySubcategoryChart from "./charts/CategorySubcategoryChart";
import Link from "next/link";

interface TrendingArticle {
  id: number;
  title: string;
  likes_count: number;
  comments_count: number;
  published_at: string;
}

interface RecentActivity {
  id: number;
  description: string;
  created_at: string;
  type: string;
}

interface CategorySubcategoryStats {
  name: string;
  articles_count: number;
  type: "category" | "subcategory";
}

interface EnhancedDashboardProps {
  stats: {
    activeUsers: number;
    inactiveUsers: number;
    activeUsersTrend: number;
    totalArticles: number;
    totalLikes: number;
    totalComments: number;
    pageViewsLast30Days: number;
    newUsersLast30Days: number;
    trendingTopics: number;
    mostLikedArticle?: {
      id: number;
      title: string;
      likes_count: number;
    };
  };
  trendingArticles?: TrendingArticle[];
  recentActivity?: RecentActivity[];
  categorySubcategoryStats?: CategorySubcategoryStats[];
}

export default function EnhancedDashboard({
  stats,
  trendingArticles = [],
  recentActivity = [],
  categorySubcategoryStats = [],
}: EnhancedDashboardProps) {
  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-blue-50 text-base">
              Here&apos;s what&apos;s happening with your content today.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 shadow-lg">
            <ClockIcon className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
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

      {/* Content Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trending Articles */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
            <FireIcon className="h-6 w-6 text-orange-500 mr-2" />
            Trending Now
          </h2>
          <div className="space-y-3">
            {trendingArticles.length > 0 ? (
              trendingArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl hover:from-blue-100 hover:to-blue-50 transition-all duration-200 border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2">{article.title}</h3>
                    <p className="text-xs text-gray-600 flex items-center gap-3">
                      <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full">
                        <HandThumbUpIcon className="h-3.5 w-3.5 text-purple-600" />
                        <span className="font-medium">{article.likes_count.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full">
                        <ChatBubbleLeftIcon className="h-3.5 w-3.5 text-blue-600" />
                        <span className="font-medium">{article.comments_count.toLocaleString()}</span>
                      </span>
                      <span className="text-gray-400">• {formatDate(article.published_at)}</span>
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-center">
                  <p className="font-medium text-sm text-gray-500">No trending articles at the moment</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Stats</h2>
          <div className="space-y-3">
            {/* Comments count */}
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
            {/* New Users count */}
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
      </div>

      {/* Charts and Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CategorySubcategoryChart data={categorySubcategoryStats} />

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/dashboard/articles/create"
              className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 text-sm font-semibold text-center border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
            >
              New Article
            </Link>
            <Link
              href="/dashboard/articles"
              className="p-4 bg-gradient-to-br from-green-50 to-green-100 text-green-700 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200 text-sm font-semibold text-center border border-green-200 hover:border-green-300 shadow-sm hover:shadow-md"
            >
              Articles
            </Link>
            <Link
              href="/dashboard/categories"
              className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 text-sm font-semibold text-center flex items-center justify-center gap-2 border border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md"
            >
              <FolderIcon className="h-4 w-4" />
              Categories
            </Link>
            <Link
              href="/dashboard/tags"
              className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-200 text-sm font-semibold text-center flex items-center justify-center gap-2 border border-orange-200 hover:border-orange-300 shadow-sm hover:shadow-md"
            >
              <TagIcon className="h-4 w-4" />
              Tags
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div
                  className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${activity.type === "comment"
                    ? "bg-blue-500"
                    : activity.type === "article"
                      ? "bg-green-500"
                      : activity.type === "user"
                        ? "bg-purple-500"
                        : activity.type === "like"
                          ? "bg-pink-500"
                          : "bg-gray-500"
                    }`}
                ></div>
                <span className="flex-1 text-sm font-medium text-gray-700">{activity.description}</span>
                <span className="text-xs text-gray-500 ml-3 font-medium">{formatDate(activity.created_at)}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mx-auto mb-2"></div>
                <span className="text-sm text-gray-500 font-medium">No recent activity</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 