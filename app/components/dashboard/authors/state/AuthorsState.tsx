"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAuthors,
  deleteAuthor,
} from "@/app/lib/actions/authors";
import { Author } from "@/app/lib/definition";
import AuthorsTable from "../table/AuthorsTable";
import AuthorsHeader from "../header/AuthorsHeader";
import AuthorsSearch from "../search/AuthorsSearch";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import {
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";
import { toast } from "react-hot-toast";

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

  // State management
  const [isDeleting, setIsDeleting] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [_isSearching, setIsSearching] = useState(false);
  const [_isSorting, setIsSorting] = useState(false);

  // URL parameters with defaults
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 5;
  const searchQuery = searchParams.get("query") || "";
  const sortField = (searchParams.get("sortField") as keyof Author) || "created_at";
  const sortDirection = (searchParams.get("sortDirection") as "asc" | "desc") || "desc";

  // Fetch authors data when dependencies change
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!_isSearching && !_isSorting) {
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
          throw new Error(result.error);
        }

        setAuthors(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalItems(result.totalItems || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setIsSorting(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, sortField, sortDirection, searchQuery, _isSearching, _isSorting]);

  // Event handlers
  const handlePageChange = (_page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", _page.toString());
    router.push(`/dashboard/authors?${params.toString()}`);
  };

  const handleSort = (_field: keyof Author) => {
    setIsSorting(true);
    const newDirection = _field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", _field as string);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/authors?${params.toString()}`);
  };

  const handleEdit = (_author: Author) => {
    router.push(`/dashboard/authors/${_author.id}/edit`);
  };

  const handleDelete = async (_author: Author) => {
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
      const success = await deleteAuthor(Number(_author.id));

      if (!success) {
        throw new Error("Failed to delete author");
      }

      router.refresh();

      const result = await getAuthors({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        sortField: String(sortField),
        sortDirection,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setAuthors(result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotalItems(result.totalItems || 0);

      if (result.data?.length === 0 && currentPage > 1) {
        const newPage = currentPage - 1;
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`/dashboard/authors?${params.toString()}`);
      }

      showErrorToast({ message: "Author deleted successfully" });
    } catch (error) {
      console.error("Error deleting author:", error);
      showErrorToast({
        message: error instanceof Error ? error.message : "Failed to delete author. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = (_term: string) => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (_term) {
      params.set("query", _term);
    } else {
      params.delete("query");
    }
    router.push(`/dashboard/authors?${params.toString()}`);
  };

  const handleItemsPerPageChange = (_limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", _limit.toString());
    router.push(`/dashboard/authors?${params.toString()}`);
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
