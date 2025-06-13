"use client";

import React from "react";
import Card from "../shared/Card";
import Grid from "../shared/Grid";
import { ImageCarousel } from "../shared/ImageCarousel";
import { StarIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { getFeaturedArticles } from "@/app/lib/actions/featured-articles";

interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  category_name: string;
  subcategory_name: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  tag_names: string[];
  tag_colors: string[];
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  images: string[];
}

export default function FeaturedArticles() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [displayCount, setDisplayCount] = React.useState(8); // Initial display count (2 rows of 4)
  const [hasMore, setHasMore] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Handle view click
  const handleViewClick = (articleId: number) => {
    console.log("View clicked for article:", articleId);
    // Add your view handling logic here
  };

  // Handle like click
  const handleLikeClick = (articleId: number) => {
    console.log("Like clicked for article:", articleId);
    // Add your like handling logic here
  };

  // Handle comment click
  const handleCommentClick = (articleId: number) => {
    console.log("Comment clicked for article:", articleId);
    // Add your comment handling logic here
  };

  // Handle share click
  const handleShareClick = (articleId: number) => {
    console.log("Share clicked for article:", articleId);
    // Add your share handling logic here
  };

  // Handle load more click
  const handleLoadMore = () => {
    setIsLoading(true);
    setDisplayCount((prev) => prev + 8); // Load 8 more articles (2 more rows)
  };

  React.useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const result = await getFeaturedArticles(1, 16); // Fetch first page with 16 items

        if (result.error) {
          throw new Error(result.error);
        }

        // Ensure each article has an images array
        const processedArticles = (result.data || []).map((article) => ({
          ...article,
          images: article.images?.length > 0 ? article.images : [article.image], // Use main image if no additional images
        }));

        setArticles(processedArticles);
        setHasMore(processedArticles.length > 8); // Set hasMore if there are more than 8 articles
        setError(null);
      } catch (error) {
        console.error("Error fetching featured articles:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch featured articles"
        );
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchFeaturedArticles();
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
        <p>No featured articles found</p>
      </div>
    );
  }

  // Get all images from articles for the carousel
  const allImages = articles.flatMap((article) => article.images);

  return (
    <>
      {/* Header section with title and description - Full width background */}
      <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw] mb-4 ">
        <div className="max-w-[1536px] mx-auto">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100">
                <StarIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured Articles
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Our top picks for you
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="max-w-[1536px] mx-auto px-4">
        {/* Image Carousel Section */}
        <div className="mb-4 h-[400px] w-full">
          <ImageCarousel
            images={articles
              .sort(
                (a, b) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              )
              .slice(0, 7)
              .map((article) => article.image)}
            alt="Featured Articles"
            autoSlide={true}
            slideInterval={5000}
            className="rounded-lg overflow-hidden"
            titles={articles
              .sort(
                (a, b) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              )
              .slice(0, 7)
              .map((article) => article.title)}
          />
        </div>

        {/* Articles Grid */}
        <Grid columns={4} gap="md">
          {articles.slice(0, displayCount).map((article) => (
            <Card
              key={article.id}
              title={article.title}
              description={article.content}
              imageUrl={article.image}
              link={`/articles/${article.id}`}
              date={article.updated_at}
              author={article.author_name}
              category={article.category_name}
              subcategory={article.subcategory_name}
              tags={article.tag_names}
              tagColors={article.tag_colors}
              viewsCount={article.views_count}
              likesCount={article.likes_count}
              commentsCount={article.comments_count}
              sharesCount={article.shares_count}
              onViewClick={() => handleViewClick(article.id)}
              onLikeClick={() => handleLikeClick(article.id)}
              onCommentClick={() => handleCommentClick(article.id)}
              onShareClick={() => handleShareClick(article.id)}
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
}
