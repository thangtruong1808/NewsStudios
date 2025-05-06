"use client";

import { useSearchParams } from "next/navigation";
import SubcategoryArticles from "../components/front-end/SubcategoryArticles";
import NotFound from "../components/front-end/NotFound";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const tag = searchParams.get("tag");
  const subcategory = searchParams.get("subcategoryId");

  // Handle different content types
  if (type === "trending") {
    return <SubcategoryArticles type="trending" />;
  }

  if (tag) {
    return <SubcategoryArticles tag={tag} />;
  }

  if (subcategory) {
    return <SubcategoryArticles subcategory={subcategory} />;
  }

  return <NotFound message="Please select a view from the navbar." />;
}
