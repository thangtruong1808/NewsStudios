import React from "react";
import Link from "next/link";
import { lusitana } from "../../components/fonts";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getArticles } from "../../lib/actions/articles";
import ArticlesTableClient from "../../components/dashboard/articles/ArticlesTableClient";

// Use static rendering by default, but revalidate every 60 seconds
export const revalidate = 60;

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function ArticlesPage({
  searchParams,
}: PageProps) {
  // Safely access search parameter without using JSON.stringify
  const searchQuery = searchParams?.search
    ? Array.isArray(searchParams.search)
      ? searchParams.search[0]
      : searchParams.search
    : "";

  const result = await getArticles();

  // Handle error case
  if (result.error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading articles
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{result.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty data case
  const articles = result.data
    ? Array.isArray(result.data)
      ? result.data
      : []
    : [];
  const hasArticles = articles.length > 0;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Articles
        </h1>
        <Link
          href="/dashboard/articles/create"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          <PlusIcon className="h-5 w-5" />
          Add Article
        </Link>
      </div>
      <div className="mt-4">
        {hasArticles ? (
          <ArticlesTableClient articles={articles} />
        ) : (
          <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
            <p className="text-gray-500">
              No articles found. Create your first article
              to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
