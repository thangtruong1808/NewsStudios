"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/app/lib/actions/categories";
import { getAuthors } from "@/app/lib/actions/authors";
import { getSubcategories } from "@/app/lib/actions/subcategories";
import { getUsers } from "@/app/lib/actions/users";
import { getAllTags } from "@/app/lib/actions/tags";
import ArticleFormContainer from "@/app/components/dashboard/articles/form/ArticleFormContainer";
import FormSkeleton from "@/app/components/dashboard/shared/skeleton/FormSkeleton";

export default function CreateArticlePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    categories: any[];
    authors: any[];
    subcategories: any[];
    users: any[];
    tags: any[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [
          categoriesResult,
          authorsResult,
          subcategoriesResult,
          usersResult,
          tagsResult,
        ] = await Promise.all([
          getCategories({ page: 1, limit: 1000 }), // Get all categories
          getAuthors({ page: 1, limit: 1000 }), // Get all authors
          getSubcategories({ page: 1, limit: 1000 }), // Get all subcategories
          getUsers({ page: 1, limit: 1000 }), // Get all users
          getAllTags(), // Get all tags
        ]);

        // Check for errors
        if (categoriesResult.error) {
          setError(categoriesResult.error);
          return;
        }

        if (authorsResult.error) {
          setError(authorsResult.error);
          return;
        }

        if (subcategoriesResult.error) {
          setError(subcategoriesResult.error);
          return;
        }

        if (usersResult.error) {
          setError(usersResult.error);
          return;
        }

        if (tagsResult.error) {
          setError(tagsResult.error);
          return;
        }

        // Set the data
        setData({
          categories: categoriesResult.data || [],
          authors: authorsResult.data || [],
          subcategories: subcategoriesResult.data || [],
          users: usersResult.data || [],
          tags: tagsResult.data || [],
        });
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full">
        <FormSkeleton fields={8} showHeader={true} showActions={true} />
      </div>
    );
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
        tags={data.tags}
      />
    </div>
  );
}
