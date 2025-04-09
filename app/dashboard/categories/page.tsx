import Link from "next/link";
import { SearchWrapper } from "../../components/dashboard/search";
import { lusitana } from "../../components/fonts";
import { PlusIcon } from "@heroicons/react/24/outline";
import CategoriesTableClient from "../../components/dashboard/categories/CategoriesTableClient";
import { getCategories } from "../../lib/actions/categories";
import { Category } from "../../type/definitions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let categories: Category[] = [];
  let error = null;

  try {
    const result = await getCategories();
    if (result.error) {
      error = result.error;
    } else if (result.data) {
      categories = Array.isArray(result.data) ? result.data : [];
    }
  } catch (err) {
    console.error("Error in CategoriesPage:", err);
    error = err instanceof Error ? err.message : "Failed to load categories";
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Categories Management
        </h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <SearchWrapper placeholder="Search Categories..." />
        <Link
          href="/dashboard/categories/create"
          className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <span className="hidden md:block">Create Category</span>{" "}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading categories
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CategoriesTableClient categories={categories} />
      )}
    </div>
  );
}
