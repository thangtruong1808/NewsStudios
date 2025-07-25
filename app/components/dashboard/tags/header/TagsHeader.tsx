"use client";

import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

export default function TagsHeader() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-blue-500">Tags List</h1>
        <p className="mt-1 text-sm ">
          Manage, organize, and assign tags to articles for better content
          categorization and searchability.
        </p>
      </div>

      {isAdmin && (
        <Link
          href="/dashboard/tags/create"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 justify-center items-center"
        >
          <PlusIcon className="h-5 mr-2" />
          <span>Create Tag</span>
        </Link>
      )}
    </div>
  );
}
