"use client";

import { useSearchParams } from "next/navigation";
import NotFound from "../components/front-end/NotFound";
import NavBar from "../components/front-end/NavBar";
import ExploreContent from "../components/front-end/explore/ExploreContent";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const tag = searchParams.get("tag");
  const subcategory = searchParams.get("subcategoryId");

  // Handle different content types
  if (type === "trending") {
    return (
      <div className="w-full bg-white">
        <div className="max-w-[1536px] mx-auto px-4">
          <NavBar />
          <ExploreContent type="trending" />
        </div>
      </div>
    );
  }

  if (tag) {
    return (
      <div className="w-full bg-white">
        <div className="max-w-[1536px] mx-auto px-4">
          <NavBar />
          <ExploreContent tag={tag} />
        </div>
      </div>
    );
  }

  if (subcategory) {
    return (
      <div className="w-full bg-white">
        <div className="max-w-[1536px] mx-auto px-4">
          <NavBar />
          <ExploreContent subcategory={subcategory} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1536px] mx-auto px-4">
        <NavBar />
        <NotFound message="Please select a view from the navbar." />
      </div>
    </div>
  );
}
