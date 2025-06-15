"use client";

import SubcategoryArticles from "../SubcategoryArticles";
import CategoryArticles from "../CategoryArticles";

interface ExploreContentProps {
  subcategory?: string;
  categoryId?: string;
}

export default function ExploreContent({
  subcategory,
  categoryId,
}: ExploreContentProps) {
  console.log("ExploreContent props:", { subcategory, categoryId });

  return (
    <div className="space-y-8">
      {subcategory ? (
        <SubcategoryArticles subcategory={subcategory} />
      ) : categoryId ? (
        <CategoryArticles categoryId={categoryId} />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Please select a category or subcategory to view articles.
          </p>
        </div>
      )}
    </div>
  );
}
