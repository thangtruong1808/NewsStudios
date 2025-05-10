import React from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getUsers, searchUsers } from "../../lib/actions/users";
import UsersTableClient from "../../components/dashboard/users/UsersTableClient";
import UsersSearchWrapper from "../../components/dashboard/users/UsersSearchWrapper";
import { lusitana } from "../../components/fonts";

// Use static rendering by default, but revalidate every 60 seconds
export const revalidate = 60;

interface PageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function UsersPage(props: PageProps) {
  // Await searchParams before accessing its properties
  const searchParams = await props.searchParams;
  const searchQuery = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  // Use searchUsers if there's a search query, otherwise use getUsers
  const result = searchQuery
    ? await searchUsers(searchQuery)
    : await getUsers();

  // Handle error case
  if (result.error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading users
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{result.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty data case
  const users = result.data || [];
  const hasUsers = users.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Link
          href="/dashboard/users/create"
          className="inline-flex items-center gap-1 rounded-md border border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Create User</span>
        </Link>
      </div>

      <div className="mt-4">
        <UsersSearchWrapper />
      </div>

      {hasUsers ? (
        <UsersTableClient users={users} searchQuery={searchQuery} />
      ) : (
        <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">
            {searchQuery
              ? "No users found matching your search criteria."
              : "No users found. Create your first user to get started."}
          </p>
        </div>
      )}
    </div>
  );
}
