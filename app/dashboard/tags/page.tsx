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
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tags List</h1>
          {/* Description for TagsPage */}
          <p className="mt-1 text-sm text-gray-500">
            Manage, organize, and assign tags to categorize your articles and
            content for better discoverability and structure.
          </p>
        </div>

        <Link
          href="/dashboard/tags/create"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-violet-700 hover:to-fuchsia-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 justify-center items-center"
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
