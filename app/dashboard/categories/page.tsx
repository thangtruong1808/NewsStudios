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
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Categories List
            </h1>
            {/* Description for CategoriesPage */}
            <p className="mt-1 text-sm text-gray-500">
              Manage, organize, and assign categories to articles for better
              content organization and navigation.
            </p>
          </div>
          <Link
            href="/dashboard/categories/create"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-violet-700 hover:to-fuchsia-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 justify-center items-center"
          >
            <PlusIcon className="h-5 mr-2" />
            <span>Create Category</span>
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
