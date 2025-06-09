"use client";

import { useEffect, useState } from "react";
import { getArticleById } from "@/app/lib/actions/articles";
import { getCategories } from "@/app/lib/actions/categories";
import { getAuthors } from "@/app/lib/actions/authors";
import { getSubcategories } from "@/app/lib/actions/subcategories";
import { getUsers } from "@/app/lib/actions/users";
import { getAllTags } from "@/app/lib/actions/tags";
import ArticleFormContainer from "@/app/components/dashboard/articles/form/ArticleFormContainer";
import FormSkeleton from "@/app/components/dashboard/shared/skeleton/FormSkeleton";
import { notFound } from "next/navigation";

interface EditArticlePageProps {
  params: {
    id: string;
  };
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
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
        const [
          articleResult,
          categoriesResult,
          authorsResult,
          subcategoriesResult,
          usersResult,
          tagsResult,
        ] = await Promise.all([
          getArticleById(parseInt(params.id)),
          getCategories({ page: 1, limit: 1000 }),
          getAuthors({ page: 1, limit: 1000 }),
          getSubcategories({ page: 1, limit: 1000 }),
          getUsers({ page: 1, limit: 1000 }),
          getAllTags(),
        ]);

        if (articleResult.error || !articleResult.data) {
          setError("Article not found");
          return;
        }

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

        setData({
          article: articleResult.data,
          categories: categoriesResult.data || [],
          authors: authorsResult.data || [],
          subcategories: subcategoriesResult.data || [],
          users: usersResult.data || [],
          tags: tagsResult.data || [],
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
        <FormSkeleton
          fields={8} // Number of fields in the article form: title, content, category, author, subcategory, user, image, video
          showHeader={true}
          showActions={true}
        />
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
        users={data.users}
        tags={data.tags}
      />
    </div>
  );
}
