import { getTags } from "../../lib/actions/tags";
import TagsTableClient from "../../components/dashboard/tags/TagsTableClient";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Tag } from "../../lib/definition";
import { SearchWrapper } from "../../components/dashboard/search";

// Use force-dynamic to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TagsPage() {
  let tags: Tag[] = [];
  let error = null;

  try {
    const result = await getTags();
    if (result.error) {
      error = result.error;
    } else if (result.data) {
      // Ensure we have an array of tags
      tags = Array.isArray(result.data) ? result.data : [];
    }
  } catch (err) {
    console.error("Error in TagsPage:", err);
    error = err instanceof Error ? err.message : "Failed to load tags";
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Tags</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <SearchWrapper placeholder="Search Tags..." />
        <Link
          href="/dashboard/tags/create"
          className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <span className="hidden md:block">Add Tag</span>
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading tags
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <TagsTableClient tags={tags} />
      )}
    </div>
  );
}
