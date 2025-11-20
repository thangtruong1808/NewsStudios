"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/app/lib/actions/categories";
import { getAuthors } from "@/app/lib/actions/authors";
import { getSubcategories } from "@/app/lib/actions/subcategories";
import { getUsers } from "@/app/lib/actions/users";
import ArticleFormContainer from "@/app/components/dashboard/articles/form/ArticleFormContainer";
import FormSkeleton from "@/app/components/dashboard/shared/skeleton/FormSkeleton";

// Component Info
// Description: Load and render article creation form with data fetching and skeleton states.
// Date updated: 2025-November-21
// Author: thangtruong

export default function CreateArticlePageClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    categories: any[];
    authors: any[];
    subcategories: any[];
    users: any[];
  } | null>(null);

  // Fetch required data for article creation form
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories, authors, and users in parallel
        const [categories, authors, users] = await Promise.all([
          getCategories(),
          getAuthors(),
          getUsers(),
        ]);

        // Get all subcategories without filtering by category
        const subcategories = await getSubcategories({
          page: 1,
          limit: 1000,
        });

        setData({
          categories: categories.data || [],
          authors: authors.data || [],
          subcategories: subcategories.data || [],
          users: users.data || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (isLoading) {
    return <FormSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return null;
  }

  // Main form render
  return (
    <div className="bg-gray-50">
      <ArticleFormContainer
        categories={data.categories}
        authors={data.authors}
        subcategories={data.subcategories}
        tags={[]}
      />
    </div>
  );
} 