import { getAuthors, searchAuthors } from "../../lib/actions/authors";
import AuthorsTableClient from "../../components/dashboard/authors/AuthorsTableClient";
import AuthorsSearchWrapper from "../../components/dashboard/authors/AuthorsSearchWrapper";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Author } from "../../login/login-definitions";

export const dynamic = "force-dynamic";

interface AuthorsPageProps {
  searchParams?: Promise<{
    query?: string;
  }>;
}

export default async function AuthorsPage({ searchParams }: AuthorsPageProps) {
  // Await searchParams before accessing its properties
  const searchParamsResolved = await searchParams;
  const searchQuery = searchParamsResolved?.query || "";

  // Use searchAuthors if there's a search query, otherwise use getAuthors
  const result = searchQuery
    ? await searchAuthors(searchQuery)
    : await getAuthors();

  const authors = Array.isArray(result.data) ? (result.data as Author[]) : [];
  const error = result.error;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-gray-900">Authors List</h1>
        <Link
          href="/dashboard/author/create"
          className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <span className="hidden md:block">Create Author</span>{" "}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      <div className="mt-4">
        <AuthorsSearchWrapper />
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AuthorsTableClient authors={authors} />
      )}
    </div>
  );
}
