"use client";

import {
  DocumentTextIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import GetExploreStats from "./GetExploreStats";
import { LoadingSpinner } from "../../shared/LoadingSpinner";

interface ExploreStatsProps {
  type?: "trending";
  tag?: string;
  subcategory?: string;
}

export default function ExploreStats({
  type,
  tag,
  subcategory,
}: ExploreStatsProps) {
  const { stats, isLoading, error } = GetExploreStats({
    type,
    tag,
    subcategory,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-xl mb-8">
        <p className="text-red-700 text-center">{error}</p>
      </div>
    );
  }

  const statItems = [
    {
      name: "Total Articles",
      value: stats.totalArticles,
      icon: DocumentTextIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Total Views",
      value: stats.totalViews,
      icon: EyeIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Total Likes",
      value: stats.totalLikes,
      icon: HeartIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      name: "Total Comments",
      value: stats.totalComments,
      icon: ChatBubbleLeftIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.name}
            className={`${item.bgColor} rounded-xl p-4 flex items-center gap-3`}
          >
            <div className={`p-2 rounded-lg ${item.color} bg-white`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{item.name}</p>
              <p className={`text-xl font-semibold ${item.color}`}>
                {item.value.toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
