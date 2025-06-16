import { getDashboardStats } from "@/app/lib/actions/dashboard";
import DashboardSkeleton from "@/app/components/dashboard/DashboardSkeleton";
import EnhancedDashboard from "@/app/components/dashboard/EnhancedDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <EnhancedDashboard stats={stats.data || { activeUsers: 0, activeUsersTrend: 0, totalArticles: 0 }} />
  );
}
