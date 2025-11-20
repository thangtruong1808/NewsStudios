"use client";

// Component Info
// Description: Display recent activity feed with color-coded activity types.
// Date updated: 2025-November-21
// Author: thangtruong

interface RecentActivity {
  id: number;
  description: string;
  created_at: string;
  type: string;
}

interface RecentActivitySectionProps {
  recentActivity: RecentActivity[];
  formatDate: (_dateString: string) => string;
}

export default function RecentActivitySection({
  recentActivity,
  formatDate,
}: RecentActivitySectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      {/* Section Header */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
      {/* Activity List */}
      <div className="space-y-3">
        {recentActivity.length > 0 ? (
          recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
            >
              {/* Activity Type Indicator */}
              <div
                className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${
                  activity.type === "comment"
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
              {/* Activity Description */}
              <span className="flex-1 text-sm font-medium text-gray-700">{activity.description}</span>
              {/* Activity Timestamp */}
              <span className="text-xs text-gray-500 ml-3 font-medium">{formatDate(activity.created_at)}</span>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mx-auto mb-2"></div>
              <span className="text-sm text-gray-500 font-medium">No recent activity</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

