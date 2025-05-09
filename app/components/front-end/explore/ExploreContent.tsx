"use client";

import SubcategoryArticles from "../SubcategoryArticles";
import ExploreTrendingTags from "../trending/ExploreTrendingTags";
import ExploreQuickLinks from "./ExploreQuickLinks";

interface ExploreContentProps {
  type?: "trending";
  tag?: string;
  subcategory?: string;
}

export default function ExploreContent({
  type,
  tag,
  subcategory,
}: ExploreContentProps) {
  return (
    <>
      <SubcategoryArticles type={type} tag={tag} subcategory={subcategory} />
      <div className="mt-8 max-w-[1024px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
          {/* Explore More Tags Column */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Explore More Tags
            </h3>
            <ExploreTrendingTags />
          </div>
          {/* Quick Links Column */}
          <ExploreQuickLinks />
        </div>
      </div>
    </>
  );
}
