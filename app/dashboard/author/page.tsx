"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAuthors,
  searchAuthors,
  deleteAuthor,
} from "@/app/lib/actions/authors";
import { Author } from "@/app/lib/definition";
import AuthorsTable from "@/app/components/dashboard/authors/table/AuthorsTable";
import AuthorsSearch from "@/app/components/dashboard/authors/search/AuthorsSearch";
import { PlusIcon } from "@heroicons/react/24/outline";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import Link from "next/link";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";

interface AuthorsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    sortField?: string;
    sortDirection?: "asc" | "desc";
    query?: string;
    limit?: string;
  };
}

export default function AuthorsPage({ searchParams }: AuthorsPageProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  // Extract and parse URL parameters for pagination and sorting
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = Number(searchParams.limit) || 5;
  const searchQuery = searchParams.query || "";
  const sortField = (searchParams.sortField as keyof Author) || "created_at";
  const sortDirection = searchParams.sortDirection || "desc";

  // Table column configuration
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
      field: "articles_count",
      label: "Articles",
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

  // Fetch authors data based on search and pagination parameters
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSearching && !isSorting) {
          setIsLoading(true);
        }
        const result = searchQuery
          ? await searchAuthors(searchQuery, currentPage, itemsPerPage)
          : await getAuthors(currentPage, itemsPerPage);

        setAuthors(result.data || []);
        if (result.total !== undefined) {
          setTotalPages(Math.ceil(result.total / itemsPerPage));
          setTotalItems(result.total);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setIsSorting(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, sortField, sortDirection, searchQuery]);

  const handleDelete = async (author: Author) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Author",
        message:
          "Are you sure you want to delete this author? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const { success, error } = await deleteAuthor(author.id);

      if (!success) {
        throw new Error(error || "Failed to delete author");
      }

      // Force a router refresh to ensure we get fresh data
      router.refresh();

      // Refresh the data after successful deletion
      const result = searchQuery
        ? await searchAuthors(searchQuery, currentPage, itemsPerPage)
        : await getAuthors(currentPage, itemsPerPage);

      if (result.error) {
        throw new Error(result.error);
      }

      // Update the state with the new data
      setAuthors(result.data || []);
      if (result.total !== undefined) {
        setTotalPages(Math.ceil(result.total / itemsPerPage));
        setTotalItems(result.total);
      }

      // If we're on the last page and it's now empty, go to the previous page
      if (result.data?.length === 0 && currentPage > 1) {
        const newPage = currentPage - 1;
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`/dashboard/author?${params.toString()}`);
      }

      showSuccessToast({ message: "Author deleted successfully" });
    } catch (error) {
      console.error("Error deleting author:", error);
      showErrorToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete author. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/dashboard/author?${params.toString()}`);
  };

  const handleSort = (field: keyof Author) => {
    setIsSorting(true);
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/author?${params.toString()}`);
  };

  const handleEdit = (author: Author) => {
    router.push(`/dashboard/author/${author.id}/edit`);
  };

  const handleSearch = (term: string) => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.push(`/dashboard/author?${params.toString()}`);
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", limit.toString());
    router.push(`/dashboard/author?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header section with title and create button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-blue-500">Authors List</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage authors and their articles for better content organization
            and attribution.
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
      <AuthorsSearch onSearch={handleSearch} />

      {/* Main content area */}
      {isLoading ? (
        <TableSkeleton columns={columns} itemsPerPage={itemsPerPage} />
      ) : (
        <AuthorsTable
          authors={authors}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          sortField={sortField}
          sortDirection={sortDirection}
          onPageChange={handlePageChange}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onItemsPerPageChange={handleItemsPerPageChange}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
