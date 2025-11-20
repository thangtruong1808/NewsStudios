"use client";

import { useState, useEffect } from "react";
import { getHighlightArticles } from "@/app/lib/actions/highlight-articles";
import { Article } from "@/app/lib/definition";
import { StarIcon } from "@heroicons/react/24/outline";
import Card from "@/app/components/front-end/shared/Card";
import { ImageCarousel } from "@/app/components/front-end/shared/ImageCarousel";
import HighlightArticlesSkeleton from "./HighlightArticlesSkeleton";

type HighlightArticleRaw = {
  id?: number | string;
  title?: string | null;
  content?: string | null;
  image?: string | null;
  category_id?: number | string | null;
  sub_category_id?: number | string | null;
  author_id?: number | string | null;
  user_id?: number | string | null;
  category_name?: string | null;
  subcategory_name?: string | null;
  author_name?: string | null;
  published_at?: string | Date | null;
  updated_at?: string | Date | null;
  headline_priority?: number | string | null;
  is_featured?: boolean | number | null;
  is_trending?: boolean | number | null;
  tag_names?: string[] | string | null;
  tag_ids?: number[] | string | null;
  tag_colors?: string[] | string | null;
  likes_count?: number | string | null;
  comments_count?: number | string | null;
  views_count?: number | string | null;
};

const normalizeHighlightArticle = (
  article: HighlightArticleRaw
): Article => {
  const parseStringArray = (value?: string[] | string | null): string[] => {
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }
    if (typeof value === "string") {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };

  const parseIdArray = (value?: number[] | string | null): number[] => {
    if (Array.isArray(value)) {
      return value.map((item) => Number(item ?? 0));
    }
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => Number(item.trim()))
        .filter((num) => !Number.isNaN(num));
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
    description: undefined,
    category_id:
      article.category_id !== undefined && article.category_id !== null
        ? Number(article.category_id)
        : undefined,
    sub_category_id:
      article.sub_category_id !== undefined && article.sub_category_id !== null
        ? Number(article.sub_category_id)
        : undefined,
    author_id:
      article.author_id !== undefined && article.author_id !== null
        ? Number(article.author_id)
        : undefined,
    user_id:
      article.user_id !== undefined && article.user_id !== null
        ? Number(article.user_id)
        : undefined,
    image: typeof article.image === "string" ? article.image : undefined,
    video: undefined,
    published_at: parseDate(article.published_at),
    is_featured: Boolean(article.is_featured),
    headline_priority: Number(article.headline_priority ?? 0),
    headline_image_url: undefined,
    headline_video_url: undefined,
    is_trending: Boolean(article.is_trending),
    updated_at: parseDate(article.updated_at),
    category_name:
      typeof article.category_name === "string" ? article.category_name : undefined,
    subcategory_name:
      typeof article.subcategory_name === "string"
        ? article.subcategory_name
        : undefined,
    author_name:
      typeof article.author_name === "string" ? article.author_name : undefined,
    tag_names: parseStringArray(article.tag_names),
    tag_ids: parseIdArray(article.tag_ids),
    tag_colors: parseStringArray(article.tag_colors),
    likes_count: Number(article.likes_count ?? 0),
    comments_count: Number(article.comments_count ?? 0),
    views_count: Number(article.views_count ?? 0),
  };
};

// Component Info
// Description: Showcase highlight articles with carousel, grid, and pagination controls.
// Date updated: 2025-November-21
// Author: thangtruong
export default function HighlightArticles() {
  // State management for articles, loading state, and error handling
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const ITEMS_PER_PAGE = 6; // 3 columns × 2 rows

  // Fetch highlight articles on component mount
  useEffect(() => {
    const fetchHighlightArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getHighlightArticles({
          page,
          itemsPerPage: ITEMS_PER_PAGE,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        const rawArticles = Array.isArray(result.data)
          ? (result.data as HighlightArticleRaw[])
          : [];
        const newArticles = rawArticles.map(normalizeHighlightArticle);

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
        setError("Failed to load highlight articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlightArticles();
  }, [page]);

  // Handle load more click
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Loading state display
  if (isLoading) {
    return <HighlightArticlesSkeleton />;
  }

  // Error state display
  if (error) {
    return (
      <>
        {/* Header section with title and description */}
        <div className="w-screen bg-slate-100 relative left-1/2 right-1/2 -mx-[50vw] mb-8">
          <div className="max-w-[1536px] mx-auto px-6">
            <div className="py-8">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 shadow-sm">
                  <StarIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Highlight Articles</h2>
                  <p className="text-sm text-gray-600 mt-1">Top stories that deserve your attention</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
          <div className="max-w-[1536px] mx-auto px-6">
            <div className="bg-red-50 border border-red-200 rounded-xl shadow-sm p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                  <StarIcon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-red-900">Error Loading Articles</h3>
                <p className="text-red-700 max-w-md">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // No articles found state
  if (articles.length === 0) {
    return (
      <>
        {/* Header section with title and description */}
        <div className="w-screen bg-slate-100 relative left-1/2 right-1/2 -mx-[50vw] mb-8">
          <div className="max-w-[1536px] mx-auto px-6">
            <div className="py-8">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 shadow-sm">
                  <StarIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Highlight Articles</h2>
                  <p className="text-sm text-gray-600 mt-1">Top stories that deserve your attention</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty state message */}
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
          <div className="max-w-[1536px] mx-auto px-6">
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100">
                  <StarIcon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">No Highlight Articles Available</h3>
                <p className="text-gray-500 max-w-md">
                  We&apos;re preparing some amazing stories for you. Stay tuned for our highlighted content!
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const sortedCarouselArticles = [...articles]
    .sort(
      (a, b) =>
        new Date(b.published_at || "").getTime() -
        new Date(a.published_at || "").getTime()
    )
    .slice(0, 7);

  return (
    <>
      {/* Header section with title and description */}
      <div className="w-screen bg-orange-100 relative left-1/2 right-1/2 -mx-[50vw] mb-8">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 shadow-sm">
                <StarIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Highlight Articles</h2>
                <p className="text-sm text-gray-600 mt-1">Top stories that deserve your attention</p>
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
              images={sortedCarouselArticles.map((article) => article.image || "").filter(Boolean)}
              alt="Highlight Articles"
              autoSlide
              slideInterval={5000}
              className="rounded-lg overflow-hidden shadow-xl"
              titles={sortedCarouselArticles.map((article) => article.title)}
              dates={sortedCarouselArticles.map((article) => article.published_at || "")}
              articleIds={sortedCarouselArticles.map((article) => article.id)}
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {articles.slice(0, page * ITEMS_PER_PAGE).map((article) => (
              <Card
                key={article.id}
                title={article.title}
                description={article.content}
                imageUrl={article.image || undefined}
                link={`/articles/${article.id}`}
                category={article.category_name}
                subcategory={article.subcategory_name}
                author={article.author_name}
                date={article.published_at}
                likesCount={article.likes_count}
                commentsCount={article.comments_count}
                tags={article.tag_names}
                tagColors={article.tag_colors}
              />
            ))}
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
        </div>
      </div>
    </>
  );
}
