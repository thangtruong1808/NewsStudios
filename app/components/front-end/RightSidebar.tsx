"use client";

import GetTrendingTags from "./trending/GetTrendingTags";

export default function RightSidebar() {
  return (
    <div className="hidden lg:block w-64 bg-stone-200 text-white p-2 justify-around rounded-lg p-3">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-emerald-500 mb-5">
            Trending Tags
          </h3>
          <GetTrendingTags />
        </div>
      </div>
    </div>
  );
}
