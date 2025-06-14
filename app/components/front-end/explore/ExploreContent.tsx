"use client";

import SubcategoryArticles from "../SubcategoryArticles";
import CategoryArticles from "../CategoryArticles";

interface ExploreContentProps {
  subcategory?: string;
  category?: string;
  categoryId?: string;
}

export default function ExploreContent({
  subcategory,
  category,
  categoryId,
}: ExploreContentProps) {
  return (
    <div className="space-y-8">
      {subcategory ? (
        <SubcategoryArticles subcategory={subcategory} />
      ) : categoryId ? (
        <CategoryArticles category={categoryId} />
      ) : category ? (
        <CategoryArticles category={category} />
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
