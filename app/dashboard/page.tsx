import React from "react";
import { Suspense } from "react";
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: any;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <FireIcon className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6 px-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="mt-2 text-blue-100">
            Here's what's happening with your content today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Views"
            value="2,543"
            icon={ChartBarIcon}
            trend="↑ 12% from last week"
          />
          <StatCard
            title="Active Users"
            value="1,234"
            icon={UserGroupIcon}
            trend="↑ 8% from last week"
          />
          <StatCard title="Articles" value="156" icon={DocumentTextIcon} />
          <StatCard title="Trending Topics" value="12" icon={FireIcon} />
        </div>

        {/* Trending Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
            Trending Now
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium">Trending Article {item}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This article is gaining traction with readers
                  </p>
                </div>
                <div className="text-sm text-gray-500">2.{item}k views</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                New Article
              </button>
              <button className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                Analytics
              </button>
              <button className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                Comments
              </button>
              <button className="p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors">
                Settings
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center text-sm text-gray-600"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>New comment on Article {item}</span>
                  <span className="ml-auto text-gray-400">2h ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
