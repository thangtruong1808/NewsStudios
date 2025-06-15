"use client";

import { useSearchParams } from "next/navigation";
import NotFound from "../components/front-end/NotFound";
import ExploreContent from "../components/front-end/explore/ExploreContent";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const tag = searchParams.get("tag");
  const subcategory = searchParams.get("subcategoryId");
  const categoryId = searchParams.get("categoryId");

  console.log("ExplorePage URL params:", {
    type,
    tag,
    subcategory,
    categoryId,
  });

  if (subcategory) {
    return <ExploreContent subcategory={subcategory} />;
  }

  if (categoryId) {
    return <ExploreContent categoryId={categoryId} />;
  }

  return <NotFound message="Please select a view from the navbar." />;
}
