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
  // const [articles, setArticles] = useState<Article[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalCount, setTotalCount] = useState(0);
  // const [hasMore, setHasMore] = useState(false);
  // const articlesRef = useRef<Article[]>([]);
  // const itemsPerPage = 10;

  if (subcategory) {
    return <SubcategoryArticles subcategory={subcategory} />;
  }

  if (categoryId) {
    return <CategoryArticles categoryId={categoryId} />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <p className="text-gray-500">
          Please select a category or subcategory to view articles.
        </p>
      </div>
    </div>
  );
}
