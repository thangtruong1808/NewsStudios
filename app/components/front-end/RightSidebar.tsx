"use client";

import GetTrendingTags from "./trending/GetTrendingTags";

export default function RightSidebar() {
  return (
    <div className="hidden lg:block w-64 bg-stone-200 text-white p-2 rounded-lg mt-4">
      <div className="flex flex-col space-y-6">
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
