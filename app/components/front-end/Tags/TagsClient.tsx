"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { TagIcon } from "@heroicons/react/24/outline";
import { getFilteredTags } from "@/app/lib/actions/front-end-tags";
import TagsSkeleton from "./TagsSkeleton";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import type { NavMenuCategory, NavMenuSubcategory } from "../navbar/types";

// Component Info
// Description: Client interface for browsing tags with category and subcategory filters.
// Data created: Local filter state driving tag pagination and API requests.
// Author: thangtruong

interface TagsClientProps {
  categories: NavMenuCategory[];
}

export default function TagsClient({ categories }: TagsClientProps) {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [availableSubcategories, setAvailableSubcategories] = useState<NavMenuSubcategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalTags, setTotalTags] = useState(0);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat.id === Number(selectedCategory));
      setAvailableSubcategories(category ? category.subcategories : []);
      setSelectedSubcategory("");
    } else {
      setAvailableSubcategories([]);
      setSelectedSubcategory("");
    }
  }, [selectedCategory, categories]);

  const fetchTags = useCallback(async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const result = await getFilteredTags(
        selectedCategory || undefined,
        selectedSubcategory || undefined,
        pageNumber,
        ITEMS_PER_PAGE
      );

      if (result.error) {
        throw new Error(result.error);
      }

      const newTags = result.data || [];
      if (pageNumber === 1) {
        setTags(newTags);
      } else {
        setTags((prev) => [...prev, ...newTags]);
      }

      setTotalTags(result.totalCount);
      setHasMore(result.totalCount > pageNumber * ITEMS_PER_PAGE);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubcategory, ITEMS_PER_PAGE]);

  useEffect(() => {
    setCurrentPage(1);
    setTags([]);
    fetchTags(1);
  }, [selectedCategory, selectedSubcategory, fetchTags]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchTags(nextPage);
  };

  if (loading && tags.length === 0) {
    return <TagsSkeleton />;
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative left-1/2 right-1/2 w-screen -mx-[50vw] bg-gray-200">
        <div className="mx-auto max-w-[1536px]">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <TagIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Popular Tags</h2>
                <p className="mt-1 text-sm text-gray-500">Explore articles by tags</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative left-1/2 right-1/2 w-screen -mx-[50vw]">
        <div className="mx-auto max-w-[1536px] px-6">
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <label htmlFor="category" className="mb-1 block text-md font-medium text-black">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 px-2 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="subcategory" className="mb-1 block text-md font-medium text-black">
                Subcategory
              </label>
              <select
                id="subcategory"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 px-2 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!selectedCategory}
              >
                <option value="">All Subcategories</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {selectedCategory === "" && (
                <span className="mt-1 text-sm text-gray-500">Please select a category first</span>
              )}
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            Showing {tags.length} of {totalTags} tags
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6">
            {tags.map((tag) => (
              <Link key={tag.id} href={`/articles/tag/${tag.id}`} className="group block">
                <div
                  className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-500"
                  style={{ backgroundColor: tag.color }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <span className="text-xs font-medium text-white">{tag.name}</span>
                    <span className="text-xs text-white">{tag.article_count} articles</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && tags.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
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
    </>
  );
}

