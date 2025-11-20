"use client";

import { useEffect, useState } from "react";
import { getArticleById } from "@/app/lib/actions/articles";
import { getCategories } from "@/app/lib/actions/categories";
import { getAuthors } from "@/app/lib/actions/authors";
import { getSubcategories } from "@/app/lib/actions/subcategories";
import { getUsers } from "@/app/lib/actions/users";
import { getAllTags } from "@/app/lib/actions/tags";
import { getTagsBySubcategory } from "@/app/lib/actions/tags";
import ArticleFormContainer from "@/app/components/dashboard/articles/form/ArticleFormContainer";
import FormSkeleton from "@/app/components/dashboard/shared/skeleton/FormSkeleton";
import { useParams } from "next/navigation";

// Component Info
// Description: Load and render article edit form with data fetching and skeleton states.
// Date updated: 2025-November-21
// Author: thangtruong

export default function EditArticlePage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    article: any;
    categories: any[];
    authors: any[];
    subcategories: any[];
    users: any[];
    tags: any[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch the article to get its subcategory_id
        const articleResult = await getArticleById(Number(params.id));
        if (articleResult.error) {
          setError(articleResult.error);
          return;
        }

        const article = articleResult.data;
        if (!article) {
          setError("Article not found");
          return;
        }

        // Fetch all other data in parallel
        const [
          categoriesResult,
          authorsResult,
          subcategoriesResult,
          usersResult,
          allTagsResult,
          subcategoryTagsResult,
        ] = await Promise.all([
          getCategories({ page: 1, limit: 1000 }),
          getAuthors({ page: 1, limit: 1000 }),
          getSubcategories({ page: 1, limit: 1000 }),
          getUsers({ page: 1, limit: 1000 }),
          getAllTags(),
          article.sub_category_id
            ? getTagsBySubcategory(article.sub_category_id)
            : Promise.resolve({ data: [], error: null }),
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

        if (allTagsResult.error) {
          setError(allTagsResult.error);
          return;
        }

        if (subcategoryTagsResult.error) {
          setError(subcategoryTagsResult.error);
          return;
        }

        // Set the data
        setData({
          article,
          categories: categoriesResult.data || [],
          authors: authorsResult.data || [],
          subcategories: subcategoriesResult.data || [],
          users: usersResult.data || [],
          tags: subcategoryTagsResult.data || [],
        });
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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
        article={data.article}
        categories={data.categories}
        authors={data.authors}
        subcategories={data.subcategories}
        tags={data.tags}
      />
    </div>
  );
}
