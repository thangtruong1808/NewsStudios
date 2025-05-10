import { getTags, searchTags } from "../../lib/actions/tags";
import TagsTableClient from "../../components/dashboard/tags/TagsTableClient";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Tag } from "../../lib/definition";
import TagsSearchWrapper from "../../components/dashboard/tags/TagsSearchWrapper";

// Use force-dynamic to ensure fresh data
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: {
    query?: string;
  };
}

export default async function TagsPage({ searchParams }: PageProps) {
  let tags: Tag[] = [];
  let error = null;

  try {
    const searchQuery = searchParams?.query || "";
    const result = searchQuery
      ? await searchTags(searchQuery)
      : await getTags();

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
        <Link
          href="/dashboard/tags/create"
          className="inline-flex items-center gap-1 rounded-md border border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Tag</span>
        </Link>
      </div>

      <div className="mt-4">
        <TagsSearchWrapper />
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
