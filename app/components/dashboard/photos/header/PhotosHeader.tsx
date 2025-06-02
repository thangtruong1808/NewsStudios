"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

/**
 * PhotosHeader Component
 *
 * Displays the header section of the Photos page including:
 * - Title with gradient text
 * - Description
 * - "Add Photo" button
 */
export default function PhotosHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-blue-500">Photos List</h1>
        <p className="mt-1 text-sm ">
          Manage your photo gallery and media content.
        </p>
      </div>
      <Link
        href="/dashboard/photos/create"
        className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 justify-center items-center"
      >
        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Add Photo
      </Link>
    </div>
  );
}
