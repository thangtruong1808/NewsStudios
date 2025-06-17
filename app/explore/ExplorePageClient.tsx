"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import NotFound from "../components/front-end/NotFound";
import ExploreContent from "../components/front-end/explore/ExploreContent";

function ExploreContentWrapper() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const tag = searchParams.get("tag");
  const subcategory = searchParams.get("subcategoryId");
  const categoryId = searchParams.get("categoryId");

  //This is a common development practice where console logs are only shown during development to help debug the application, and they won't appear in production. It's particularly useful for tracking URL parameters and their values while developing the explore page functionality
  if (process.env.NODE_ENV === 'development') {
    console.log("ExplorePage URL params:", {
      type,
      tag,
      subcategory,
      categoryId,
    });
  }

  if (subcategory) {
    return <ExploreContent subcategory={subcategory} />;
  }

  if (categoryId) {
    return <ExploreContent categoryId={categoryId} />;
  }

  return <NotFound message="Please select a view from the navbar." />;
}

export default function ExplorePageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExploreContentWrapper />
    </Suspense>
  );
} 