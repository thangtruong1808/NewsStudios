import React from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  getSubcategories,
  searchSubcategories,
} from "../../lib/actions/subcategories";
import SubcategoriesTableClient from "../../components/dashboard/subcategories/SubcategoriesTableClient";
import SubcategoriesSearchWrapper from "../../components/dashboard/subcategories/SubcategoriesSearchWrapper";

interface SubcategoriesPageProps {
  searchParams?: Promise<{
    query?: string;
  }>;
}

export default async function SubcategoriesPage({
  searchParams,
}: SubcategoriesPageProps) {
  // Await searchParams before accessing its properties
  const searchParamsResolved = await searchParams;
  const query = searchParamsResolved?.query || "";

  // Use searchSubcategories if there's a search query, otherwise use getSubcategories
  const result = query
    ? await searchSubcategories(query)
    : await getSubcategories();

  // Handle error case
  if (result.error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading subcategories
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
  const subcategories = result.data || [];
  const hasSubcategories = subcategories.length > 0;

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Subcategories List
          </h1>
          {/* Description for SubcategoriesPage */}
          <p className="mt-1 text-sm text-gray-500">
            Manage, organize, and assign subcategories to further classify your
            articles and content within categories for improved structure and
            navigation.
          </p>
        </div>

        <Link
          href="/dashboard/subcategories/create"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-violet-700 hover:to-fuchsia-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 justify-center items-center"
        >
          <PlusIcon className="h-5 mr-2" />
          <span>Create Subcategory</span>
        </Link>
      </div>

      <div className="mt-4">
        <SubcategoriesSearchWrapper />
      </div>

      {hasSubcategories ? (
        <SubcategoriesTableClient subcategories={subcategories} />
      ) : (
        <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">
            {query
              ? "No subcategories found matching your search criteria."
              : "No subcategories found. Create your first subcategory to get started."}
          </p>
        </div>
      )}
    </div>
  );
}
