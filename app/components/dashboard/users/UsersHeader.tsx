"use client";

import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

/**
 * UsersHeader Component
 * Displays the header section of the users management page with title, description,
 * and a create user button. The component is responsive and adapts its layout
 * based on screen size.
 */
export default function UsersHeader() {
  return (
    // Container with responsive flex layout
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Title and description section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Users List</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage, organize, and assign roles to users for better access control
          and collaboration within your dashboard.
        </p>
      </div>

      {/* Create User button with gradient background and hover effects */}
      <Link
        href="/dashboard/users/create"
        className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 justify-center items-center"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Create User</span>
      </Link>
    </div>
  );
}
