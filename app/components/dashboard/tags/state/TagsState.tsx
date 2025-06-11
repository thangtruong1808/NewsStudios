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
    handlePageChange: (page: number) => void;
    handleSort: (field: keyof (Tag & { sequence?: number })) => void;
    handleEdit: (tag: Tag) => void;
    handleDelete: (tag: Tag) => void;
    handleSearch: (term: string) => void;
    handleItemsPerPageChange: (limit: number) => void;
  }) => React.ReactNode;
}

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
  const itemsPerPage = Number(searchParams.get("itemsPerPage")) || 10;
  const searchQuery = searchParams.get("search") || "";
  const sortField =
    (searchParams.get("sortField") as keyof Tag) || "created_at";
  const sortDirection =
    (searchParams.get("sortDirection") as "asc" | "desc") || "desc";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSearching && !isSorting) {
          setIsLoading(true);
        }
        console.log("TagsState fetching data with params:", {
          searchQuery,
          currentPage,
          itemsPerPage,
          sortField,
          sortDirection,
        });

        const result = searchQuery
          ? await searchTags(searchQuery, {
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

        console.log("TagsState received result:", result);

        setTags(result.data || []);
        if (result.totalItems !== undefined) {
          const newTotalPages = Math.ceil(result.totalItems / itemsPerPage);
          console.log("TagsState calculating pages:", {
            totalItems: result.totalItems,
            itemsPerPage,
            newTotalPages,
          });
          setTotalPages(newTotalPages);
          setTotalItems(result.totalItems);
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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/dashboard/tags?${params.toString()}`);
  };

  const handleSort = (field: keyof (Tag & { sequence?: number })) => {
    setIsSorting(true);
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/tags?${params.toString()}`);
  };

  const handleEdit = (tag: Tag) => {
    router.push(`/dashboard/tags/${tag.id}/edit`);
  };

  const handleDelete = async (tag: Tag) => {
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
      const { error } = await deleteTag(tag.id);

      if (error) {
        showErrorToast({ message: error });
        return;
      }

      // Force a router refresh to ensure we get fresh data
      router.refresh();

      // Fetch fresh data after successful deletion
      const result = searchQuery
        ? await searchTags(searchQuery)
        : await getTags({
            page: currentPage,
            limit: itemsPerPage,
            sortField,
            sortDirection,
          });

      if (result.error) {
        throw new Error(result.error);
      }

      // Update the state with the new data
      setTags(result.data || []);
      if (result.totalItems !== undefined) {
        setTotalPages(Math.ceil(result.totalItems / itemsPerPage));
        setTotalItems(result.totalItems);
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
      console.error("Error deleting tag:", error);
      showErrorToast({ message: "Failed to delete tag. Please try again." });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = (term: string) => {
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

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("itemsPerPage", limit.toString());
    router.push(`/dashboard/tags?${params.toString()}`);
  };

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
