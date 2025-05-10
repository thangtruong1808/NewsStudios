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
            className="inline-flex items-center gap-1 rounded-md border border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Create Sponsor</span>
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
