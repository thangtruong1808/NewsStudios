"use client";

import Link from "next/link";
import { StarIcon, NewspaperIcon, FireIcon } from "@heroicons/react/24/outline";
import GetLeftSidebar from "../trending/GetLeftSidebar";

export default function ExploreQuickLinks() {
  const { featuredCount, headlinesCount, trendingCount, isLoading, error } =
    GetLeftSidebar();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-pulse flex space-x-4">
          <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-xl">
        <p className="text-red-700 text-center">{error}</p>
      </div>
    );
  }

  const links = [
    {
      name: "Featured",
      href: "/explore?type=featured",
      icon: StarIcon,
      count: featuredCount,
      color: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
    },
    {
      name: "Headlines",
      href: "/explore?type=headlines",
      icon: NewspaperIcon,
      count: headlinesCount,
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    },
    {
      name: "Trending",
      href: "/explore?type=trending",
      icon: FireIcon,
      count: trendingCount,
      color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${link.color} transition-colors duration-200`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{link.name}</span>
            <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-sm font-medium bg-white rounded-full">
              {link.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
