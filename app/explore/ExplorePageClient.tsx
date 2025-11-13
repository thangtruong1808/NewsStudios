"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import NotFound from "../components/front-end/NotFound";
import ExploreContent from "../components/front-end/explore/ExploreContent";

function ExploreContentWrapper() {
  const searchParams = useSearchParams();
  const subcategory = searchParams.get("subcategoryId");
  const categoryId = searchParams.get("categoryId");

  // Prioritize subcategory view when query parameter provided.
  if (subcategory) {
    return <ExploreContent subcategory={subcategory} />;
  }

  // Fallback to category view.
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