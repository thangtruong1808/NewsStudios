"use client";

import { getSponsors } from "../../../lib/actions/sponsors";
import { getArticles } from "../../../lib/actions/articles";
import { getCategories } from "../../../lib/actions/categories";
import CreateAdvertisementForm from "../../../components/dashboard/advertisements/CreateAdvertisementForm";
import { Sponsor, Article, Category } from "../../../lib/definition";
import { useEffect, useState } from "react";

interface ActionResult<T> {
  data: T | null;
  error: string | null;
}

export default function CreateAdvertisementPage() {
  const [sponsors, setSponsors] = useState<{ id: number; name: string }[]>([]);
  const [articles, setArticles] = useState<{ id: number; title: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [sponsorsResult, articlesResult, categoriesResult] =
          await Promise.all([getSponsors(), getArticles(), getCategories()]);

        if (sponsorsResult.error || categoriesResult.error) {
          setError(sponsorsResult.error || categoriesResult.error);
          return;
        }

        setSponsors(
          (sponsorsResult.data || []).map((sponsor) => ({
            id: sponsor.id,
            name: sponsor.name,
          }))
        );

        setArticles(
          (articlesResult || []).map((article) => ({
            id: article.id,
            title: article.title,
          }))
        );

        setCategories(
          (categoriesResult.data || []).map((category) => ({
            id: category.id,
            name: category.name,
          }))
        );
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Create Advertisement
        </h1>
        <CreateAdvertisementForm
          sponsors={sponsors}
          articles={articles}
          categories={categories}
          onSubmit={async (data) => {
            // This is a placeholder - the actual submission will be handled by the form component
            console.log("Form submitted with data:", data);
          }}
        />
      </div>
    </div>
  );
}
