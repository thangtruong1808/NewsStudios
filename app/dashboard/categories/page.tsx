import { Suspense } from "react";
import Link from "next/link";
import { Category } from "../../type/definitions";
import CategoriesTableClient from "../../components/dashboard/categories/CategoriesTableClient";
import CategoriesSearchWrapper from "../../components/dashboard/categories/CategoriesSearchWrapper";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { getCategories, searchCategories } from "../../lib/actions/categories";

interface CategoriesPageProps {
  searchParams?: Promise<{
    query?: string;
  }>;
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  // Await searchParams before accessing its properties
  const searchParamsResolved = await searchParams;
  const query = searchParamsResolved?.query || "";

  try {
    // Use searchCategories if there's a search query, otherwise use getCategories
    const result = query
      ? await searchCategories(query)
      : await getCategories();

    if (result.error) {
      return <ErrorMessage error={new Error(result.error)} />;
    }

    const categories = result.data || [];

    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 md:mt-8">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Categories
          </h1>
          <Link
            href="/dashboard/categories/create"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Add Category
          </Link>
        </div>
        <div className="mt-4">
          <CategoriesSearchWrapper />
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          {categories.length > 0 ? (
            <CategoriesTableClient categories={categories} />
          ) : (
            <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
              <p className="text-gray-500">
                {query
                  ? "No categories found matching your search criteria."
                  : "No categories found. Create your first category to get started."}
              </p>
            </div>
          )}
        </Suspense>
      </div>
    );
  } catch (error) {
    return <ErrorMessage error={error as Error} />;
  }
}
