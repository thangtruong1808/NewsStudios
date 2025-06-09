"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * PhotosHeader Component
 *
 * Displays the header section of the Photos page including:
 * - Title with gradient text
 * - Description
 * - "Add Photo" button (only for admin users)
 */
export default function PhotosHeader() {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-900">Photos</h1>
      {isAdmin && (
        <button
          onClick={() => router.push("/dashboard/photos/create")}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          <PlusIcon className="h-5 w-5" />
          Add Photo
        </button>
      )}
    </div>
  );
}
