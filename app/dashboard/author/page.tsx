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
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";

// Remove revalidate since we're using client component
// export const revalidate = 60;

export default function AuthorsPage() {
  // Router and search params hooks for navigation and URL management
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract and parse URL parameters for pagination and search
  const searchQuery = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 5;

  // State management for authors data and UI states
  const [authors, setAuthors] = React.useState<Author[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [totalItems, setTotalItems] = React.useState(0);

  // Table column configuration for author data display
  const columns = [
    {
      field: "name",
      label: "Name",
      sortable: true,
    },
    {
      field: "description",
      label: "Description",
      sortable: true,
    },
    {
      field: "bio",
      label: "Bio",
      sortable: true,
    },
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
    },
  ];

  /**
   * Fetch authors data based on search and pagination parameters
   * Handles both regular listing and search functionality
   */
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

  /**
   * Handle sorting functionality
   * Updates URL parameters to reflect sort field changes
   */
  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field);
    router.push(`?${params.toString()}`);
  };

  /**
   * Handle pagination - navigate to selected page
   * Updates URL parameters and triggers data refresh
   */
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  /**
   * Navigate to author edit page
   * Routes to the edit form for the selected author
   */
  const handleEdit = (author: any) => {
    router.push(`/dashboard/author/${author.id}/edit`);
  };

  /**
   * Handle author deletion with confirmation
   * Includes error handling and state management
   */
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

  /**
   * Update items per page and reset to first page
   * Manages pagination size and triggers data refresh
   */
  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Check if there are any authors to display
  const hasAuthors = authors.length > 0;

  return (
    <div className="">
      {/* Header section with title and create button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-blue-500">Authors List</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage, organize, and assign authors to articles for better content
            attribution and collaboration.
          </p>
        </div>

        <Link
          href="/dashboard/author/create"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 justify-center items-center"
        >
          <PlusIcon className="h-5 mr-2" />
          <span>Create Author</span>
        </Link>
      </div>

      {/* Search functionality */}
      <div className="mt-4">
        <AuthorsSearchWrapper />
      </div>

      {/* Main content area with conditional rendering */}
      {isLoading ? (
        <TableSkeleton columns={columns} itemsPerPage={itemsPerPage} />
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
