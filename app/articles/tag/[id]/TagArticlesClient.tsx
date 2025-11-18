"use client";

import { useState, useEffect, useRef } from "react";
import { getArticlesByTag } from "@/app/lib/actions/front-end-articles";
import { getTagById } from "@/app/lib/actions/tags";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { Card } from "@/app/components/front-end/shared";
import { TagIcon } from "@heroicons/react/24/outline";
import TagArticlesSkeleton from "./TagArticlesSkeleton";

// Component Info
// Description: Client component displaying articles filtered by a specific tag with pagination.
// Date created: 2024-12-19
// Author: thangtruong

interface TagArticlesClientProps {
  params: {
    id: string;
  };
}

export default function TagArticlesClient({ params }: TagArticlesClientProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [tagInfo, setTagInfo] = useState<{
    name: string;
    color: string;
    description: string | null;
  } | null>(null);
  const itemsPerPage = 10;
  const [hasMore, setHasMore] = useState(false);
  const articlesRef = useRef<Article[]>([]);

  // Fetch tag information
  useEffect(() => {
    let isMounted = true;

    const fetchTagInfo = async () => {
      try {
        const result = await getTagById(Number(params.id));
        if (!isMounted) return;

        if (result.error) {
          throw new Error(result.error);
        }
        if (result.data) {
          setTagInfo({
            name: result.data.name,
            color: result.data.color || '#000000',
            description: result.data.description
          });
        }
      } catch (error) {
        if (!isMounted) return;
        setError(error instanceof Error ? error.message : "Failed to fetch tag information");
      }
    };

    fetchTagInfo();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  // Handle load more click
  const handleLoadMore = () => {
    if (isLoading) return;
    setCurrentPage((prev) => prev + 1);
  };

  // Fetch articles when tag ID or page changes
  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      if (!params.id) return;

      try {
        setIsLoading(true);
        const result = await getArticlesByTag({
          tagId: params.id,
          page: currentPage,
          itemsPerPage,
        });

        if (!isMounted) return;

        if (result.error) {
          throw new Error(result.error);
        }

        if (!result.data) {
          throw new Error("No data received");
        }

        const newArticles = result.data;

        if (currentPage === 1) {
          setArticles(newArticles);
          articlesRef.current = newArticles;
        } else {
          const updatedArticles = [...articlesRef.current, ...newArticles];
          articlesRef.current = updatedArticles;
          setArticles(updatedArticles);
        }

        setTotalCount(result.totalCount || 0);

        // Calculate total loaded articles
        const totalLoaded = articlesRef.current.length;
        setHasMore(result.totalCount > totalLoaded);
      } catch (error) {
        if (!isMounted) return;
        setError(
          error instanceof Error ? error.message : "Failed to fetch articles"
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchArticles();

    return () => {
      isMounted = false;
    };
  }, [params.id, currentPage, itemsPerPage]);

  // Loading state display
  if (isLoading && articles.length === 0) {
    return <TagArticlesSkeleton />;
  }

  // Error state display
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  // Empty state display
  if (articles.length === 0) {
    return (
      <div className="w-full max-w-[1536px] mx-auto px-4 mt-10">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              No Articles Found
            </h3>
            <p className="text-gray-500 max-w-md">
              We couldn&apos;t find any articles with this tag. Please check back later or explore other tags.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1536px] mx-auto px-4 mt-10">
      {/* Header Section */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] mb-8">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100">
                <TagIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {tagInfo?.name || "Articles"}
                </h1>
                {tagInfo?.description && (
                  <p className="text-gray-600 mt-2">{tagInfo.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <TagIcon className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Tag:
                    </span>
                    <span
                      className="text-sm px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: tagInfo?.color || '#000000' }}
                    >
                      {tagInfo?.name || "Loading..."}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      Total Articles:
                    </span>
                    <span className="text-sm text-gray-600">{totalCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] mb-10">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6">
            {Array.isArray(articles) && articles.map((article) => {
              // Split tag strings into arrays safely
              const tagNames = typeof article.tag_names === "string"
                ? (article.tag_names as string).split(",")
                : Array.isArray(article.tag_names)
                  ? article.tag_names
                  : [];
              const tagColors = typeof article.tag_colors === "string"
                ? (article.tag_colors as string).split(",")
                : Array.isArray(article.tag_colors)
                  ? article.tag_colors
                  : [];

              return (
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
                  tags={tagNames}
                  tagColors={tagColors}
                />
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="m-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Loading...</span>
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 