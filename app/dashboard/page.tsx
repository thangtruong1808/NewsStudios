// Component Info
// Description: Dashboard page server component fetching real-time statistics from database.
// Date created: 2025-01-27
// Author: thangtruong

import {
  getDashboardStats,
  getTrendingArticles,
  getRecentActivity,
  getCategorySubcategoryStats,
} from "@/app/lib/actions/dashboard";
import EnhancedDashboard from "@/app/components/dashboard/EnhancedDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const [statsResult, trendingArticlesResult, recentActivityResult, categorySubcategoryStatsResult] =
    await Promise.all([
      getDashboardStats(),
      getTrendingArticles(),
      getRecentActivity(),
      getCategorySubcategoryStats(),
    ]);

  return (
    <EnhancedDashboard
      stats={statsResult.data || {
        activeUsers: 0,
        inactiveUsers: 0,
        activeUsersTrend: 0,
        totalArticles: 0,
        totalLikes: 0,
        totalComments: 0,
        pageViewsLast30Days: 0,
        newUsersLast30Days: 0,
        trendingTopics: 0,
        mostLikedArticle: undefined,
      }}
      trendingArticles={trendingArticlesResult.data || []}
      recentActivity={recentActivityResult.data || []}
      categorySubcategoryStats={categorySubcategoryStatsResult.data || []}
    />
  );
}
