import { Suspense } from "react";
import Link from "next/link";
import { Category } from "../../lib/definition";
import CategoriesTableClient from "../../components/dashboard/categories/CategoriesTableClient";
import CategoriesSearchWrapper from "../../components/dashboard/categories/CategoriesSearchWrapper";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { getCategories, searchCategories } from "../../lib/actions/categories";
import { PlusIcon } from "lucide-react";

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
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Categories List
          </h1>
          <Link
            href="/dashboard/categories/create"
            className="flex h-10 items-center rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-sm font-medium text-white transition-colors hover:from-violet-700 hover:to-fuchsia-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <PlusIcon className="h-5 mr-2" />
            <span className="hidden md:block">Create Category</span>
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
