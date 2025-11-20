"use client";

// Component Info
// Description: Enhanced dashboard component displaying real-time statistics, trending articles, and recent activity from database.
// Date updated: 2025-November-21
// Author: thangtruong

import { ClockIcon } from "@heroicons/react/24/outline";
import CategorySubcategoryChart from "./charts/CategorySubcategoryChart";
import StatsCards from "./StatsCards";
import TrendingArticlesSection from "./TrendingArticlesSection";
import QuickStatsSection from "./QuickStatsSection";
import RecentActivitySection from "./RecentActivitySection";
import QuickActionsSection from "./QuickActionsSection";

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
      <StatsCards stats={stats} />

      {/* Content Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trending Articles */}
        <TrendingArticlesSection trendingArticles={trendingArticles} formatDate={formatDate} />

        {/* Quick Stats */}
        <QuickStatsSection stats={stats} />
      </div>

      {/* Charts and Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CategorySubcategoryChart data={categorySubcategoryStats} />

        {/* Quick Actions */}
        <QuickActionsSection />
      </div>

      {/* Recent Activity */}
      <RecentActivitySection recentActivity={recentActivity} formatDate={formatDate} />
    </div>
  );
} 