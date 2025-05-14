"use client";

import React from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getAuthors, searchAuthors } from "../../lib/actions/authors";
import AuthorsTableClient from "../../components/dashboard/authors/table/AuthorsTable";
import AuthorsSearchWrapper from "../../components/dashboard/authors/search/AuthorsSearch";
import { lusitana } from "../../components/fonts";
import { useRouter, useSearchParams } from "next/navigation";
import { Author } from "@/app/lib/definition";

// Loading skeleton component
function AuthorsTableSkeleton() {
  return (
    <div className="mt-8">
      <div className="animate-pulse">
        {/* Table header skeleton */}
        <div className="grid grid-cols-[50px_150px_256px_256px_128px_128px_100px] gap-4 py-3 px-4 bg-gray-50 border-b border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-8"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Table rows skeleton */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[50px_150px_256px_256px_128px_128px_100px] gap-4 py-4 px-4 border-b border-gray-200"
          >
            <div className="h-4 bg-gray-200 rounded w-8"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="flex space-x-2">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}

        {/* Pagination skeleton */}
        <div className="flex justify-between items-center mt-4 px-4">
          <div className="h-8 bg-gray-200 rounded w-36"></div>
          <div className="h-8 bg-gray-200 rounded w-72"></div>
        </div>
      </div>
    </div>
  );
}

// Remove revalidate since we're using client component
// export const revalidate = 60;

export default function AuthorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 10;
  const [authors, setAuthors] = React.useState<Author[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [totalItems, setTotalItems] = React.useState(0);

  React.useEffect(() => {
    const fetchAuthors = async () => {
      setIsLoading(true);
      const result = searchQuery
        ? await searchAuthors(searchQuery, currentPage, itemsPerPage)
        : await getAuthors(currentPage, itemsPerPage);

      if (!result.error) {
        setAuthors(result.data || []);
        if ("total" in result && typeof result.total === "number") {
          setTotalItems(result.total);
        }
      }
      setIsLoading(false);
    };

    fetchAuthors();
  }, [searchQuery, currentPage, itemsPerPage]);

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field);
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleEdit = (author: any) => {
    router.push(`/dashboard/author/${author.id}/edit`);
  };

  const handleDelete = async (author: any) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      setIsDeleting(true);
      try {
        // Add delete logic here
        router.refresh();
      } catch (error) {
        console.error("Error deleting author:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const hasAuthors = authors.length > 0;

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Authors List</h1>
          {/* Description for AuthorsPage */}
          <p className="mt-1 text-sm text-gray-500">
            Manage, organize, and assign authors to articles for better content
            attribution and collaboration.
          </p>
        </div>

        <Link
          href="/dashboard/author/create"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-violet-700 hover:to-fuchsia-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 justify-center items-center"
        >
          <PlusIcon className="h-5 mr-2" />
          <span>Create Author</span>
        </Link>
      </div>

      <div className="mt-4">
        <AuthorsSearchWrapper />
      </div>

      {isLoading ? (
        <AuthorsTableSkeleton />
      ) : hasAuthors ? (
        <AuthorsTableClient
          authors={authors}
          searchQuery={searchQuery}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          sortField="name"
          sortDirection="asc"
          isDeleting={isDeleting}
          isLoading={isLoading}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      ) : (
        <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">
            {searchQuery
              ? "No authors found matching your search criteria."
              : "No authors found. Create your first author to get started."}
          </p>
        </div>
      )}
    </div>
  );
}
