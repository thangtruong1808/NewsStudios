"use client";

import { useState, useEffect } from "react";
import { getFrontEndArticles } from "@/app/lib/actions/front-end-articles";
import { Article } from "@/app/lib/definition";
import { FireIcon } from "@heroicons/react/24/outline";
import { ImageCarousel } from "@/app/components/front-end/shared/ImageCarousel";
import Grid from "@/app/components/front-end/shared/Grid";
import Card from "@/app/components/front-end/shared/Card";
import ArticlesTrendingSkeleton from "./ArticlesTrendingSkeleton";

export function ArticlesTrending() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 10; // 5 columns × 2 rows

  // Fetch trending articles on component mount
  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getFrontEndArticles({
          type: "trending",
          page,
          itemsPerPage: ITEMS_PER_PAGE,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        const newArticles = result.data || [];
        if (page === 1) {
          setArticles(newArticles);
        } else {
          setArticles((prev) => [...prev, ...newArticles]);
        }
        setTotalCount(result.totalCount || 0);

        // Calculate total loaded articles
        const totalLoaded =
          page === 1
            ? newArticles.length
            : articles.length + newArticles.length;
        // Only show Load More if we have more articles to load and we received a full page
        setHasMore(
          result.totalCount > totalLoaded &&
          newArticles.length === ITEMS_PER_PAGE
        );
      } catch (error) {
        console.error("Error fetching trending articles:", error);
        setError("Failed to load trending articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingArticles();
  }, [page]);

  // Handle load more click
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading) {
    return <ArticlesTrendingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No trending articles found</p>
      </div>
    );
  }

  return (
    <>
      {/* Header section with title and description - Full width background */}
      <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw] mb-4">
        <div className="max-w-[1536px] mx-auto">
          <div className="py-8">
            <div className="flex items-center space-x-3 pl-4 lg:pl-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100">
                <FireIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Trending Articles
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  What&apos;s hot and happening right now
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      {/* Image Carousel Section */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="mb-4 h-[400px] w-full">
            <ImageCarousel
              images={articles
                .sort(
                  (a, b) =>
                    new Date(b.published_at || "").getTime() -
                    new Date(a.published_at || "").getTime()
                )
                .slice(0, 7)
                .map((article) => article.image || "")}
              alt="Trending Articles"
              autoSlide={true}
              slideInterval={5000}
              className="rounded-lg overflow-hidden"
              titles={articles
                .sort(
                  (a, b) =>
                    new Date(b.published_at || "").getTime() -
                    new Date(a.published_at || "").getTime()
                )
                .slice(0, 7)
                .map((article) => article.title)}
              dates={articles
                .sort(
                  (a, b) =>
                    new Date(b.published_at || "").getTime() -
                    new Date(a.published_at || "").getTime()
                )
                .slice(0, 7)
                .map((article) => article.published_at || "")}
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
            {articles.map((article) => (
              <Card
                key={article.id}
                title={article.title}
                description={article.content}
                imageUrl={article.image}
                link={`/articles/${article.id}`}
                category={article.category_name}
                subcategory={article.subcategory_name}
                author={article.author_name}
                date={article.published_at}
                viewsCount={article.views_count}
                likesCount={article.likes_count}
                commentsCount={article.comments_count}
                tags={article.tag_names}
                tagColors={article.tag_colors}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && articles.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
