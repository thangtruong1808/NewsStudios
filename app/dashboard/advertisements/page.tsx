import { Suspense } from "react";
import Link from "next/link";
import { Advertisement } from "../../lib/definition";
import AdvertisementsTableClient from "../../components/dashboard/advertisements/AdvertisementsTableClient";
import AdvertisementsSearchWrapper from "../../components/dashboard/advertisements/AdvertisementsSearchWrapper";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/dashboard/shared/loading-spinner";
import {
  getAdvertisements,
  searchAdvertisements,
} from "../../lib/actions/advertisements";
import { PlusIcon } from "lucide-react";

interface AdvertisementsPageProps {
  searchParams?: Promise<{
    query?: string;
  }>;
}

export default async function AdvertisementsPage({
  searchParams,
}: AdvertisementsPageProps) {
  // Await searchParams before accessing its properties
  const searchParamsResolved = await searchParams;
  const query = searchParamsResolved?.query || "";

  try {
    // Use searchAdvertisements if there's a search query, otherwise use getAdvertisements
    const result = query
      ? await searchAdvertisements(query)
      : await getAdvertisements();

    if (result.error) {
      return <ErrorMessage error={new Error(result.error)} />;
    }

    const advertisements = result.data || [];

    // Format advertisements to ensure required fields are present
    const formattedAdvertisements = advertisements.map((ad) => ({
      ...ad,
      sponsor_name: ad.sponsor_name || `Sponsor ID: ${ad.sponsor_id}`,
      article_title: ad.article_title || `Article ID: ${ad.article_id}`,
      category_name: ad.category_name || `Category ID: ${ad.category_id}`,
    }));

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Advertisements List
          </h1>
          <Link
            href="/dashboard/advertisements/create"
            className="inline-flex items-center gap-1 rounded-md border border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Create Advertisement</span>
          </Link>
        </div>

        <div className="mt-4">
          <AdvertisementsSearchWrapper />
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          {formattedAdvertisements.length > 0 ? (
            <AdvertisementsTableClient
              advertisements={formattedAdvertisements}
            />
          ) : (
            <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
              <p className="text-gray-500">
                {query
                  ? "No advertisements found matching your search criteria."
                  : "No advertisements found. Create your first advertisement to get started."}
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
