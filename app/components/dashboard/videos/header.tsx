"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

/**
 * VideosHeader Component
 *
 * Displays the header section of the Videos page including:
 * - Title with gradient text
 * - Description
 * - "Add Video" button
 */
export default function VideosHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Videos
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your video gallery and media content.
        </p>
      </div>
      <Link
        href="/dashboard/videos/create"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Add Video
      </Link>
    </div>
  );
}
