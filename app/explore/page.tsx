"use client";

import { useSearchParams } from "next/navigation";
import NotFound from "../components/front-end/NotFound";
import ExploreContent from "../components/front-end/explore/ExploreContent";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const tag = searchParams.get("tag");
  const subcategory = searchParams.get("subcategoryId");

  // Handle different content types
  if (type === "trending") {
    return <ExploreContent type="trending" />;
  }

  if (tag) {
    return <ExploreContent tag={tag} />;
  }

  if (subcategory) {
    return <ExploreContent subcategory={subcategory} />;
  }

  return <NotFound message="Please select a view from the navbar." />;
}
