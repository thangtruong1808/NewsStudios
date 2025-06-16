"use client";

import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  FireIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BookmarkIcon
} from "@heroicons/react/24/outline";
import { formatDateToLocal } from "@/app/lib/utils/dateFormatter";
import DashboardCharts from "./charts/DashboardCharts";

interface EnhancedDashboardProps {
  stats: {
    activeUsers: number;
    activeUsersTrend: number;
    totalArticles: number;
  };
}

export default function EnhancedDashboard({ stats }: EnhancedDashboardProps) {
  return (
    <div className="space-y-4">
      {/* Welcome Section with Quick Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="mt-1 text-blue-100 text-sm">
              Here's what's happening with your content today.
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <ClockIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-xl font-medium mt-1">{stats.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {stats.activeUsersTrend}% from last month
              </p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <UserGroupIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-xl font-medium mt-1">0</p>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <EyeIcon className="h-4 w-4 mr-1" />
                Last 30 days
              </p>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Articles</p>
              <p className="text-xl font-medium mt-1">{stats.totalArticles.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <BookmarkIcon className="h-4 w-4 mr-1" />
                Published
              </p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <DocumentTextIcon className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trending Topics</p>
              <p className="text-xl font-medium mt-1">0</p>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <FireIcon className="h-4 w-4 mr-1" />
                This week
              </p>
            </div>
            <div className="bg-orange-50 p-2 rounded-lg">
              <FireIcon className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trending Articles */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-bold mb-3 flex items-center">
            <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
            Trending Now
          </h2>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-sm">Loading trending articles...</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-bold mb-3">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ChatBubbleLeftIcon className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">Comments</span>
              </div>
              <span className="text-sm font-medium">0</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <EyeIcon className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-sm text-gray-600">Page Views</span>
              </div>
              <span className="text-sm font-medium">0</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <UserGroupIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">New Users</span>
              </div>
              <span className="text-sm font-medium">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCharts activeUsers={stats.activeUsers} />

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
              New Article
            </button>
            <button className="p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm">
              Analytics
            </button>
            <button className="p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm">
              Comments
            </button>
            <button className="p-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm">
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-bold mb-3">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span>Loading recent activity...</span>
          </div>
        </div>
      </div>

      {/* Dashboard Status Note */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Dashboard Under Development</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>We're currently enhancing the dashboard with more features and real-time data. Some statistics are still being collected and will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 