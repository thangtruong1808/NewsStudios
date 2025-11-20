"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tag } from "@/app/lib/definition";
import { getTags, searchTags, deleteTag } from "@/app/lib/actions/tags";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";

/* eslint-disable no-unused-vars */
export interface TagsStateProps {
  children: (props: {
    tags: Tag[];
    totalPages: number;
    totalItems: number;
    isLoading: boolean;
    isDeleting: boolean;
    currentPage: number;
    itemsPerPage: number;
    sortField: keyof Tag;
    sortDirection: "asc" | "desc";
    searchQuery: string;
    handlePageChange: ({ page }: { page: number }) => void;
    handleSort: ({ field }: { field: keyof Tag | "sequence" }) => void;
    handleEdit: ({ item }: { item: Tag }) => void;
    handleDelete: ({ item }: { item: Tag }) => void;
    handleSearch: ({ term }: { term: string }) => void;
    handleItemsPerPageChange: ({ limit }: { limit: number }) => void;
  }) => React.ReactNode;
}
/* eslint-enable no-unused-vars */

// Component Info
// Description: Provide tags management state container for dashboard pages.
// Date updated: 2025-November-21
// Author: thangtruong
export default function TagsState({ children }: TagsStateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  // Extract and parse URL parameters
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 10;
  const searchQuery = searchParams.get("search") || "";
  const sortField =
    (searchParams.get("sortField") as keyof Tag) || "created_at";
  const sortDirection =
    (searchParams.get("sortDirection") as "asc" | "desc") || "desc";

  // Fetch tags data when URL parameters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSearching && !isSorting) {
          setIsLoading(true);
        }

        // Use searchTags if search query exists and is not empty
        const trimmedQuery = searchQuery.trim();
        const result = trimmedQuery
          ? await searchTags(trimmedQuery, {
              page: currentPage,
              limit: itemsPerPage,
              sortField,
              sortDirection,
            })
          : await getTags({
              page: currentPage,
              limit: itemsPerPage,
              sortField,
              sortDirection,
            });

        if (result.error) {
          showErrorToast({
            message: result.error,
          });
          setTags([]);
          setTotalPages(1);
          setTotalItems(0);
        } else {
          const tagsData = Array.isArray(result.data) ? result.data : [];
          setTags(tagsData);
          
          // Set pagination info if available
          if (result.totalCount !== undefined) {
            setTotalItems(result.totalCount);
            const calculatedPages = itemsPerPage > 0 
              ? Math.max(1, Math.ceil(result.totalCount / itemsPerPage))
              : 1;
            setTotalPages(calculatedPages);
          } else if (result.totalPages !== undefined) {
            setTotalPages(Math.max(1, result.totalPages));
            setTotalItems(result.totalCount || 0);
          }
        }
      } catch (_error) {
        showErrorToast({ message: "Failed to load tags. Please try again." });
        setTags([]);
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

  // Handle page navigation
  const handlePageChange = ({ page }: { page: number }) => {
    if (page === currentPage) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    const target = params.toString();
    if (target === searchParams.toString()) return;
    router.push(`/dashboard/tags?${target}`);
  };

  // Handle column sorting
  const handleSort = ({ field }: { field: keyof Tag | "sequence" }) => {
    if (field === "sequence") return;
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    const target = params.toString();
    if (target === searchParams.toString()) return;
    setIsSorting(true);
    router.push(`/dashboard/tags?${target}`);
  };

  const handleEdit = ({ item }: { item: Tag }) => {
    router.push(`/dashboard/tags/${item.id}/edit`);
  };

  const handleDelete = async ({ item }: { item: Tag }) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Tag",
        message:
          "Are you sure you want to delete this tag? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const { error } = await deleteTag(item.id);

      if (error) {
        showErrorToast({ message: error });
        return;
      }

      // Force a router refresh to ensure we get fresh data
      router.refresh();

      // Fetch fresh data after successful deletion
      const trimmedQuery = searchQuery.trim();
      const result = trimmedQuery
        ? await searchTags(trimmedQuery, {
            page: currentPage,
            limit: itemsPerPage,
            sortField,
            sortDirection,
          })
        : await getTags({
            page: currentPage,
            limit: itemsPerPage,
            sortField,
            sortDirection,
          });

      if ("error" in result && result.error) {
        throw new Error(result.error);
      }

      // Update the state with the new data
      setTags(result.data || []);
      if (result.totalCount !== undefined) {
        setTotalItems(result.totalCount);
        const calculatedPages = itemsPerPage > 0 
          ? Math.max(1, Math.ceil(result.totalCount / itemsPerPage))
          : 1;
        setTotalPages(calculatedPages);
      }

      // If we're on the last page and it's now empty, go to the previous page
      if (result.data?.length === 0 && currentPage > 1) {
        const newPage = currentPage - 1;
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`/dashboard/tags?${params.toString()}`);
      }

      showSuccessToast({ message: "Tag deleted successfully" });
    } catch (error) {
      showErrorToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete tag. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle search functionality
  const handleSearch = ({ term }: { term: string }) => {
    if (term === searchQuery) return;
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.push(`/dashboard/tags?${params.toString()}`);
  };

  // Handle items per page change
  const handleItemsPerPageChange = ({ limit }: { limit: number }) => {
    if (limit === itemsPerPage) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", limit.toString());
    router.push(`/dashboard/tags?${params.toString()}`);
  };

  // Render children with current tag state controls
  return (
    <>
      {children({
        tags,
        totalPages,
        totalItems,
        isLoading,
        isDeleting,
        currentPage,
        itemsPerPage,
        sortField,
        sortDirection,
        searchQuery,
        handlePageChange,
        handleSort,
        handleEdit,
        handleDelete,
        handleSearch,
        handleItemsPerPageChange,
      })}
    </>
  );
}
