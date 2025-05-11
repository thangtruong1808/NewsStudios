import React from "react";
import Link from "next/link";
import { lusitana } from "../../components/fonts";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getArticles } from "../../lib/actions/articles";
import { ArticlesTableClient } from "../../components/dashboard/articles/ArticlesTableClient";
import { Article } from "../../lib/definition";
import ArticlesSearchWrapper from "../../components/dashboard/articles/ArticlesSearchWrapper";

// Use static rendering by default, but revalidate every 60 seconds
export const revalidate = 60;

interface PageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function ArticlesPage(props: PageProps) {
  // Await searchParams before accessing its properties
  const searchParams = await props.searchParams;
  const searchQuery = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  let articles: Article[] = [];
  let error: string | null = null;

  try {
    articles = await getArticles();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load articles";
  }

  // Handle error case
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading articles
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty data case and ensure proper typing
  const hasArticles = articles.length > 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className=" text-2xl font-semibold text-gray-900">
            Articles List
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your articles and their content
          </p>
        </div>
        <Link
          href="/dashboard/articles/create"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-violet-700 hover:to-fuchsia-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 justify-center items-center"
        >
          <PlusIcon className="h-6 w-6" />
          Add Article
        </Link>
      </div>

      <div className="mt-4">
        <ArticlesSearchWrapper />
      </div>

      {hasArticles ? (
        <ArticlesTableClient articles={articles} searchQuery={searchQuery} />
      ) : (
        <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">
            {searchQuery
              ? "No articles found matching your search criteria."
              : "No articles found. Create your first article to get started."}
          </p>
        </div>
      )}
    </div>
  );
}
