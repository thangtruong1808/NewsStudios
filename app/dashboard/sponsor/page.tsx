import { Suspense } from "react";
import Link from "next/link";
import { Sponsor } from "../../lib/definition";
import SponsorsTableClient from "../../components/dashboard/sponsors/SponsorsTableClient";
import SponsorsSearchWrapper from "../../components/dashboard/sponsors/SponsorsSearchWrapper";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { getSponsors, searchSponsors } from "../../lib/actions/sponsors";
import { PlusIcon } from "@heroicons/react/24/outline";

interface SponsorsPageProps {
  searchParams?: Promise<{
    query?: string;
  }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SponsorsPage({
  searchParams,
}: SponsorsPageProps) {
  // Await searchParams before accessing its properties
  const searchParamsResolved = await searchParams;
  const query = searchParamsResolved?.query || "";

  try {
    // Use searchSponsors if there's a search query, otherwise use getSponsors
    const result = query ? await searchSponsors(query) : await getSponsors();

    if (result.error) {
      return <ErrorMessage error={new Error(result.error)} />;
    }

    const sponsors = result.data || [];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Sponsors List
          </h1>
          <Link
            href="/dashboard/sponsor/create"
            className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <span className="hidden md:block">Create Sponsor</span>
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
        </div>

        <div className="mt-4">
          <SponsorsSearchWrapper />
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          {sponsors.length > 0 ? (
            <SponsorsTableClient sponsors={sponsors} />
          ) : (
            <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
              <p className="text-gray-500">
                {query
                  ? "No sponsors found matching your search criteria."
                  : "No sponsors found. Create your first sponsor to get started."}
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
