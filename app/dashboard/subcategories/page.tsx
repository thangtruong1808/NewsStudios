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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          Subcategories List
        </h1>
        <Link
          href="/dashboard/subcategories/create"
          className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <span className="hidden md:block">Create Subcategory</span>{" "}
          <PlusIcon className="h-5 md:ml-4" />
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
