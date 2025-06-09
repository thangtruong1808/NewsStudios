"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAuthors,
  searchAuthors,
  deleteAuthor,
} from "@/app/lib/actions/authors";
import { Author } from "@/app/lib/definition";
import AuthorsTable from "../table/AuthorsTable";
import AuthorsHeader from "../header/AuthorsHeader";
import AuthorsSearch from "../search/AuthorsSearch";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";

interface AuthorsStateProps {
  children: (props: {
    authors: Author[];
    totalPages: number;
    totalItems: number;
    isLoading: boolean;
    isDeleting: boolean;
    currentPage: number;
    itemsPerPage: number;
    sortField: keyof Author;
    sortDirection: "asc" | "desc";
    searchQuery: string;
    handlePageChange: (page: number) => void;
    handleSort: (field: keyof Author) => void;
    handleEdit: (author: Author) => void;
    handleDelete: (author: Author) => void;
    handleSearch: (term: string) => void;
    handleItemsPerPageChange: (limit: number) => void;
  }) => React.ReactNode;
}

export default function AuthorsState({ children }: AuthorsStateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  // Get URL parameters
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("itemsPerPage")) || 5;
  const searchQuery = searchParams.get("search") || "";
  const sortField = searchParams.get("sortField") || "created_at";
  const sortDirection =
    (searchParams.get("sortDirection") as "asc" | "desc") || "desc";

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setIsLoading(true);
        const result = searchQuery
          ? await searchAuthors({
              search: searchQuery,
              page: currentPage,
              limit: itemsPerPage,
              sortField,
              sortDirection,
            })
          : await getAuthors({
              page: currentPage,
              limit: itemsPerPage,
              sortField,
              sortDirection,
            });

        if (result.error) {
          throw new Error(result.error);
        }

        if (result.data) {
          setAuthors(result.data);
          setTotalPages(result.totalPages || 1);
          setTotalItems(result.totalItems || 0);
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setIsSorting(false);
      }
    };

    fetchAuthors();
  }, [currentPage, itemsPerPage, searchQuery, sortField, sortDirection]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/dashboard/author?${params.toString()}`);
  };

  const handleSort = (field: keyof Author) => {
    const params = new URLSearchParams(searchParams);
    const currentDirection = params.get("sortDirection") as "asc" | "desc";
    const newDirection = currentDirection === "asc" ? "desc" : "asc";
    params.set("sortField", field);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/author?${params.toString()}`);
    setIsSorting(true);
  };

  const handleEdit = (author: Author) => {
    router.push(`/dashboard/author/${author.id}/edit`);
  };

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
      const result = await deleteAuthor(author.id);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete author");
      }

      // Refresh the authors list after successful deletion
      const updatedResult = await getAuthors({
        page: currentPage,
        limit: itemsPerPage,
        sortField,
        sortDirection,
      });

      if (updatedResult.data) {
        setAuthors(updatedResult.data);
        setTotalPages(updatedResult.totalPages || 1);
        setTotalItems(updatedResult.totalItems || 0);
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

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to first page on new search
    router.push(`/dashboard/author?${params.toString()}`);
    setIsSearching(true);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("itemsPerPage", newItemsPerPage.toString());
    params.set("page", "1"); // Reset to first page when changing items per page
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
          sortField={sortField as keyof Author}
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
