"use client";

import { FireIcon, TagIcon, FolderIcon } from "@heroicons/react/24/outline";

interface ExploreHeroProps {
  type?: "trending";
  tag?: string;
  subcategory?: string;
}

export default function ExploreHero({
  type,
  tag,
  subcategory,
}: ExploreHeroProps) {
  const getHeroContent = () => {
    if (type === "trending") {
      return {
        title: "Trending Articles",
        description:
          "Discover the most popular and engaging content that's making waves right now",
        icon: FireIcon,
        bgColor: "bg-orange-50",
        textColor: "text-orange-700",
      };
    }
    if (tag) {
      return {
        title: `Articles tagged "${tag}"`,
        description: "Explore articles related to this topic",
        icon: TagIcon,
        bgColor: "bg-indigo-50",
        textColor: "text-indigo-700",
      };
    }
    if (subcategory) {
      return {
        title: "Category Articles",
        description: "Browse through articles in this category",
        icon: FolderIcon,
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
      };
    }
    return {
      title: "Explore Articles",
      description: "Discover our collection of articles across various topics",
      icon: FolderIcon,
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
    };
  };

  const content = getHeroContent();
  const Icon = content.icon;

  return (
    <div className={`${content.bgColor} rounded-2xl p-8 mb-8`}>
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-white shadow-sm mb-4">
          <Icon className={`h-6 w-6 ${content.textColor}`} />
        </div>
        <h1 className={`text-3xl font-bold ${content.textColor} mb-3`}>
          {content.title}
        </h1>
        <p className="text-gray-600 text-lg">{content.description}</p>
      </div>
    </div>
  );
}
