import React from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getAuthors, searchAuthors } from "../../lib/actions/authors";
import AuthorsTableClient from "../../components/dashboard/authors/AuthorsTableClient";
import AuthorsSearchWrapper from "../../components/dashboard/authors/AuthorsSearchWrapper";
import { lusitana } from "../../components/fonts";

// Use static rendering by default, but revalidate every 60 seconds
export const revalidate = 60;

interface PageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function AuthorsPage(props: PageProps) {
  // Await searchParams before accessing its properties
  const searchParams = await props.searchParams;
  const searchQuery = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  // Use searchAuthors if there's a search query, otherwise use getAuthors
  const result = searchQuery
    ? await searchAuthors(searchQuery)
    : await getAuthors();

  // Handle error case
  if (result.error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading authors
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
  const authors = result.data || [];
  const hasAuthors = authors.length > 0;

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Authors List</h1>
          {/* Description for AuthorsPage */}
          <p className="mt-1 text-sm text-gray-500">
            Manage, organize, and assign authors to articles for better content
            attribution and collaboration.
          </p>
        </div>

        <Link
          href="/dashboard/author/create"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-violet-700 hover:to-fuchsia-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 justify-center items-center"
        >
          <PlusIcon className="h-5 mr-2" />
          <span>Create Author</span>
        </Link>
      </div>

      <div className="mt-4">
        <AuthorsSearchWrapper />
      </div>

      {hasAuthors ? (
        <AuthorsTableClient authors={authors} searchQuery={searchQuery} />
      ) : (
        <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">
            {searchQuery
              ? "No authors found matching your search criteria."
              : "No authors found. Create your first author to get started."}
          </p>
        </div>
      )}
    </div>
  );
}
