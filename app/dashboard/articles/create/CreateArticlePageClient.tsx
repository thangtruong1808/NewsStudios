"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/app/lib/actions/categories";
import { getAuthors } from "@/app/lib/actions/authors";
import { getSubcategories } from "@/app/lib/actions/subcategories";
import { getUsers } from "@/app/lib/actions/users";
import ArticleFormContainer from "@/app/components/dashboard/articles/form/ArticleFormContainer";
import FormSkeleton from "@/app/components/dashboard/shared/skeleton/FormSkeleton";

export default function CreateArticlePageClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    categories: any[];
    authors: any[];
    subcategories: any[];
    users: any[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categories, authors, users] = await Promise.all([
          getCategories(),
          getAuthors(),
          getUsers(),
        ]);

        // Get all subcategories without filtering by category
        const subcategories = await getSubcategories({
          page: 1,
          limit: 1000, // Get all subcategories
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

  if (isLoading) {
    return <FormSkeleton />;
  }

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

  if (!data) {
    return null;
  }

  return (
    <div className="bg-gray-50">
      <ArticleFormContainer
        categories={data.categories}
        authors={data.authors}
        subcategories={data.subcategories}
        tags={[]} // Pass empty array since tags will be fetched when subcategory is selected
      />
    </div>
  );
} 