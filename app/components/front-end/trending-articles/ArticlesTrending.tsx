"use client";

import { useState, useEffect } from "react";
import { getFrontEndArticles } from "@/app/lib/actions/front-end-articles";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { FireIcon } from "@heroicons/react/24/outline";
import { ImageCarousel } from "@/app/components/front-end/shared/ImageCarousel";
import Grid from "@/app/components/front-end/shared/Grid";
import Card from "@/app/components/front-end/shared/Card";

export const ArticlesTrending = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(10); // Initial display count (2 rows of 5)
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrendingArticles = async () => {
    try {
      setLoading(true);
      const result = await getFrontEndArticles({ type: "trending" });

      if (result.error) {
        throw new Error(result.error);
      }

      const fetchedArticles = result.data || [];
      setArticles(fetchedArticles);
      setHasMore(fetchedArticles.length > 10); // Set hasMore if there are more than 10 articles
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch trending articles"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle load more click
  const handleLoadMore = () => {
    setIsLoading(true);
    setDisplayCount((prev) => prev + 10); // Load 10 more articles (2 more rows)
  };

  useEffect(() => {
    fetchTrendingArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
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
      <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw]">
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
                  What's hot and happening right now
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="max-w-[1536px] mx-auto px-4 py-8">
        {/* Image Carousel Section */}
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
          />
        </div>

        {/* Articles Grid */}
        <Grid columns={5} gap="md">
          {articles.slice(0, displayCount).map((article) => (
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
        </Grid>

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
    </>
  );
};
