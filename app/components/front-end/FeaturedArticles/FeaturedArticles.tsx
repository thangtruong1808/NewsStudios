"use client";

import { useState, useEffect } from "react";
import Card from "../shared/Card";
import { ImageCarousel } from "../shared/ImageCarousel";
import { StarIcon } from "@heroicons/react/24/outline";
import { getFeaturedArticles } from "@/app/lib/actions/featured-articles";
import FeaturedArticlesSkeleton from "./FeaturedArticlesSkeleton";

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

type FeaturedArticleRaw = {
  id?: number | string;
  title?: string | null;
  content?: string | null;
  image?: string | null;
  category_name?: string | null;
  subcategory_name?: string | null;
  author_name?: string | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
  tag_names?: string[] | string | null;
  tag_colors?: string[] | string | null;
  views_count?: number | string | null;
  likes_count?: number | string | null;
  comments_count?: number | string | null;
  shares_count?: number | string | null;
  images?: string[] | string | null;
};

const normalizeArticle = (article: FeaturedArticleRaw): Article => {
  const parseStringArray = (value?: string[] | string | null): string[] => {
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }
    if (typeof value === "string") {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };

  const parseDate = (value?: string | Date | null): string => {
    if (typeof value === "string") {
      return value;
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    return "";
  };

  return {
    id: Number(article.id ?? 0),
    title: String(article.title ?? ""),
    content: String(article.content ?? ""),
    image: typeof article.image === "string" ? article.image : "",
    category_name:
      typeof article.category_name === "string" ? article.category_name : "",
    subcategory_name:
      typeof article.subcategory_name === "string"
        ? article.subcategory_name
        : "",
    author_name:
      typeof article.author_name === "string" ? article.author_name : "",
    created_at: parseDate(article.created_at),
    updated_at: parseDate(article.updated_at),
    tag_names: parseStringArray(article.tag_names),
    tag_colors: parseStringArray(article.tag_colors),
    views_count: Number(article.views_count ?? 0),
    likes_count: Number(article.likes_count ?? 0),
    comments_count: Number(article.comments_count ?? 0),
    shares_count: Number(article.shares_count ?? 0),
    images: parseStringArray(article.images),
  };
};

// Component Info
// Description: Display featured articles with carousel, grid, and load-more controls.
// Date created: 2024-12-19
// Author: thangtruong
export default function FeaturedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const ITEMS_PER_PAGE = 8; // 4 columns × 2 rows

  // Interaction handlers (placeholder for analytics integration)
  const handleViewClick = () => { };
  const handleLikeClick = () => { };
  const handleCommentClick = () => { };
  const handleShareClick = () => { };

  // Fetch featured articles on component mount
  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getFeaturedArticles(page, ITEMS_PER_PAGE);

        if (result.error) {
          throw new Error(result.error);
        }

        const rawArticles = Array.isArray(result.data)
          ? (result.data as FeaturedArticleRaw[])
          : [];
        const newArticles = rawArticles.map(normalizeArticle);

        setArticles((prev) => {
          const merged =
            page === 1 ? newArticles : [...prev, ...newArticles];
          const totalLoaded = merged.length;
          setHasMore(
            (result.totalCount || 0) > totalLoaded &&
            newArticles.length === ITEMS_PER_PAGE
          );
          return merged;
        });
      } catch (_error) {
        setError("Failed to load featured articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, [page]);

  // Handle load more click
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading) {
    return <FeaturedArticlesSkeleton />;
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

  const sortedCarouselArticles = [...articles]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )
    .slice(0, 7);

  return (
    <>
      {/* Header section with title and description */}
      <div className="w-screen bg-slate-50 relative left-1/2 right-1/2 -mx-[50vw] mb-8">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 shadow-sm">
                <StarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
                <p className="text-sm text-gray-600 mt-1">Our top picks for you</p>
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
              images={sortedCarouselArticles.map((article) => article.image)}
              alt="Featured Articles"
              autoSlide
              slideInterval={5000}
              className="rounded-lg overflow-hidden"
              titles={sortedCarouselArticles.map((article) => article.title)}
              dates={sortedCarouselArticles.map((article) => article.updated_at)}
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {articles.slice(0, page * ITEMS_PER_PAGE).map((article) => (
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
                onViewClick={handleViewClick}
                onLikeClick={handleLikeClick}
                onCommentClick={handleCommentClick}
                onShareClick={handleShareClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Load More Button */}
      {hasMore && articles.length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}
