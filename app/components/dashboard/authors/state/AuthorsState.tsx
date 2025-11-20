"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuthors, deleteAuthor } from "@/app/lib/actions/authors";
import { Author } from "@/app/lib/definition";
import AuthorsTable from "../table/AuthorsTable";
import AuthorsHeader from "../header/AuthorsHeader";
import AuthorsSearch from "../search/AuthorsSearch";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import {
  showErrorToast,
  showConfirmationToast,
  showSuccessToast,
} from "@/app/components/dashboard/shared/toast/Toast";

// Component Info
// Description: Manage authors listing state, routing, and table interactions for the dashboard.
// Date updated: 2025-November-21
// Author: thangtruong
export default function AuthorsState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
  const [isDeleting, setIsDeleting] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  // URL parameters with defaults
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 5;
  const searchQuery = searchParams.get("query") || "";
  const sortField = (searchParams.get("sortField") as keyof Author) || "created_at";
  const sortDirection = (searchParams.get("sortDirection") as "asc" | "desc") || "desc";

  // Ensure URL has query params on initial load for consistency
  useEffect(() => {
    if (!searchParams.toString()) {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("limit", itemsPerPage.toString());
      params.set("sortField", sortField as string);
      params.set("sortDirection", sortDirection);
      if (searchQuery) {
        params.set("query", searchQuery);
      }
      router.replace(`/dashboard/author?${params.toString()}`);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch authors data when dependencies change
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSearching && !isSorting) {
          setIsLoading(true);
        }
        const result = await getAuthors({
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          sortField: String(sortField),
          sortDirection,
        });

        if (result.error) {
          showErrorToast({
            message: result.error,
          });
          setAuthors([]);
          setTotalPages(1);
          setTotalItems(0);
        } else {
          const authorsData = Array.isArray(result.data) ? result.data : [];
          setAuthors(authorsData);
          setTotalPages(result.totalPages || 1);
          setTotalItems(result.totalItems || 0);
        }
      } catch (error) {
        // Don't show error toast for empty table scenarios
        // Set empty data to show friendly empty state
        setAuthors([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setIsSorting(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, sortField, sortDirection, searchQuery]);

  // Event handlers
  const handlePageChange = ({ page }: { page: number }) => {
    if (page === currentPage) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    // Ensure consistent URL format with query params
    const target = params.toString();
    if (target === searchParams.toString()) return;
    router.push(`/dashboard/author?${target}`);
  };

  const handleSort = ({ field }: { field: keyof Author }) => {
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    const target = params.toString();
    if (target === searchParams.toString()) return;
    setIsSorting(true);
    router.push(`/dashboard/author?${target}`);
  };

  const handleEdit = ({ item }: { item: Author }) => {
    router.push(`/dashboard/author/${item.id}/edit`);
  };

  const handleDelete = async ({ item }: { item: Author }) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Author",
        message: "Are you sure you want to delete this author? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const deleteResult = await deleteAuthor(Number(item.id));

      if (!deleteResult.success) {
        throw new Error(deleteResult.error || "Failed to delete author");
      }

      router.refresh();

      const refreshedAuthors = await getAuthors({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        sortField: String(sortField),
        sortDirection,
      });

      if (refreshedAuthors.error) {
        throw new Error(refreshedAuthors.error);
      }

      setAuthors(refreshedAuthors.data || []);
      setTotalPages(refreshedAuthors.totalPages || 1);
      setTotalItems(refreshedAuthors.totalItems || 0);

      if (refreshedAuthors.data?.length === 0 && currentPage > 1) {
        const newPage = currentPage - 1;
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`/dashboard/author?${params.toString()}`);
      }

      showSuccessToast({ message: "Author deleted successfully" });
    } catch (error) {
      showErrorToast({
        message: error instanceof Error ? error.message : "Failed to delete author. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = ({ term }: { term: string }) => {
    if (term === searchQuery) return;
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

  const handleItemsPerPageChange = ({ limit }: { limit: number }) => {
    if (limit === itemsPerPage) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", limit.toString());
    router.push(`/dashboard/author?${params.toString()}`);
  };

  const columns = [
    { field: "sequence", label: "#", sortable: false },
    { field: "name", label: "Name", sortable: true },
    { field: "description", label: "Description", sortable: true },
    { field: "articles_count", label: "Articles", sortable: true },
    { field: "bio", label: "Bio", sortable: true },
    { field: "created_at", label: "Created At", sortable: true },
    { field: "updated_at", label: "Updated At", sortable: true },
    { field: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="space-y-6">
      <AuthorsHeader />
      <AuthorsSearch onSearch={handleSearch} />
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
          searchQuery={searchQuery}
          isDeleting={isDeleting}
          isLoading={isLoading}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}
