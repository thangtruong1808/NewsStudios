"use client";

// Component to display related articles with optional current article filtering
import { useState, useEffect } from "react";
import { getFrontEndRelativeArticles } from "@/app/lib/actions/front-end-relative-articles";
import { Article } from "@/app/lib/definition";
import Card from "@/app/components/front-end/shared/Card";

import RelativeArticlesSkeleton from "./RelativeArticlesSkeleton";

type RelativeArticleRaw = {
  id?: number | string;
  title?: string | null;
  content?: string | null;
  image?: string | null;
  category_name?: string | null;
  subcategory_name?: string | null;
  author_name?: string | null;
  published_at?: string | Date | null;
  updated_at?: string | Date | null;
  category_id?: number | string | null;
  sub_category_id?: number | string | null;
  author_id?: number | string | null;
  user_id?: number | string | null;
  tag_names?: string[] | string | null;
  tag_colors?: string[] | string | null;
  tag_ids?: number[] | string | null;
  likes_count?: number | string | null;
  comments_count?: number | string | null;
  views_count?: number | string | null;
  is_featured?: boolean | number | null;
  is_trending?: boolean | number | null;
  headline_priority?: number | string | null;
};

const normalizeRelativeArticle = (article: RelativeArticleRaw): Article => {
  const parseStringArray = (value?: string[] | string | null): string[] => {
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }
    if (typeof value === "string") {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };

  const parseNumberArray = (value?: number[] | string | null): number[] => {
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
    tag_ids: parseNumberArray(article.tag_ids),
    tag_colors: parseStringArray(article.tag_colors),
    likes_count: Number(article.likes_count ?? 0),
    comments_count: Number(article.comments_count ?? 0),
    views_count: Number(article.views_count ?? 0),
  };
};

/* eslint-disable no-unused-vars */
// Props interface for RelatedArticles component
interface RelativeArticlesProps {
  currentArticleId?: string; // Optional ID of current article to exclude from results
}
/* eslint-enable no-unused-vars */

// Component Info
// Description: Display related articles grid with pagination and optional current-article filtering.
// Date created: 2024-12-19
// Author: thangtruong
export default function RelativeArticles({
  currentArticleId,
}: RelativeArticlesProps) {
  // State management for articles, loading state, and error handling
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // Fetch and filter related articles on component mount or when currentArticleId changes
  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getFrontEndRelativeArticles(
          currentArticleId ? Number(currentArticleId) : undefined,
          page,
          ITEMS_PER_PAGE
        );

        if (result.error) {
          throw new Error(result.error);
        }

        const rawArticles = Array.isArray(result.data)
          ? (result.data as RelativeArticleRaw[])
          : [];
        const newArticles = rawArticles.map(normalizeRelativeArticle);

        setRelatedArticles((prev) => {
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
        setError("Failed to load related articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [currentArticleId, page]);

  // Handle load more click
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Error state display
  if (error) {
    return (
      <section className="mb-16">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Loading state display
  if (isLoading) {
    return <RelativeArticlesSkeleton />;
  }

  // Main component render with loading state and article grid
  return (
    <>
      {/* Header section with title and description */}
      <div className="w-screen bg-slate-50 relative left-1/2 right-1/2 -mx-[50vw] mb-8">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 shadow-sm">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
                <p className="text-sm text-gray-600 mt-1">Discover more articles you might be interested in</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <section className="mt-2">
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
          <div className="max-w-[1536px] mx-auto px-6">
            {relatedArticles.length > 0 ? (
              <>
                {/* Grid layout for related articles using custom grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6">
                  {relatedArticles.map((article) => (
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
                      viewsCount={article.views_count}
                      likesCount={article.likes_count}
                      commentsCount={article.comments_count}
                      tags={article.tag_names}
                      tagColors={article.tag_colors}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && relatedArticles.length >= 5 && (
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
            ) : (
              // Empty state display
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
                    <svg
                      className="h-8 w-8 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">No Related Articles Found</h3>
                  <p className="text-gray-500 max-w-md">
                    We couldn&apos;t find any related articles at the moment. Explore other sections to discover more content!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
