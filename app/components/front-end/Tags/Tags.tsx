"use client";

import { useState, useEffect } from "react";
import { getFilteredTags } from "@/app/lib/actions/front-end-tags";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { TagIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  categories,
  subcategories,
  Category,
  SubCategory,
} from "@/app/lib/data/categories";

export default function Tags() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [availableSubcategories, setAvailableSubcategories] = useState<
    SubCategory[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalTags, setTotalTags] = useState(0);
  const ITEMS_PER_PAGE = 8;

  // Update available subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const filteredSubcategories = subcategories.filter(
        (sub) => sub.category_id === Number(selectedCategory)
      );
      setAvailableSubcategories(filteredSubcategories);
      // Reset subcategory when category changes
      setSelectedSubcategory("");
    } else {
      setAvailableSubcategories([]);
      setSelectedSubcategory("");
    }
  }, [selectedCategory]);

  const fetchTags = async (page: number = 1) => {
    try {
      setLoading(true);
      const result = await getFilteredTags(
        selectedCategory || undefined,
        selectedSubcategory || undefined,
        page,
        ITEMS_PER_PAGE
      );

      if (result.error) {
        throw new Error(result.error);
      }

      const newTags = result.data || [];
      if (page === 1) {
        setTags(newTags);
      } else {
        setTags((prev) => [...prev, ...newTags]);
      }

      setTotalTags(result.totalCount);
      setHasMore(result.totalCount > page * ITEMS_PER_PAGE);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  // Initial load and reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setTags([]); // Clear existing tags
    fetchTags(1);
  }, [selectedCategory, selectedSubcategory]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchTags(nextPage);
  };

  if (loading && tags.length === 0) {
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

  return (
    <>
      {/* Header section with title and description - Full width background */}
      <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100">
                <TagIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Popular Tags
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Explore articles by tags
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="mt-8">
        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 px-2 py-2"
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
            <label
              htmlFor="subcategory"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subcategory
            </label>
            <select
              id="subcategory"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 px-2 py-2"
              disabled={!selectedCategory}
            >
              <option value="">All Subcategories</option>
              {availableSubcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Total Tags Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {tags.length} of {totalTags} tags
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/articles/tag/${tag.id}`}
              className="group block"
            >
              <div
                className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                style={{ backgroundColor: tag.color + "20" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: tag.color }}
                  >
                    {tag.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {tag.article_count} articles
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </>
  );
}
