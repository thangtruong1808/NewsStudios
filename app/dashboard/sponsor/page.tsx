import React from "react";
import { getSponsors } from "../../lib/actions/sponsors";
import SponsorsTableClient from "../../components/dashboard/sponsors/SponsorsTableClient";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export default async function SponsorsPage() {
  const { data: sponsors, error } = await getSponsors();

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Sponsors List</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <div className="w-full md:w-auto"></div>
        <Link
          href="/dashboard/sponsor/create"
          className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <span className="hidden md:block">Create Sponsor</span>
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading sponsors
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SponsorsTableClient sponsors={sponsors || []} />
      )}
    </div>
  );
}
