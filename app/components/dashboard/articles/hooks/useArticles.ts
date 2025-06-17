"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Article } from "@/app/lib/definition";
import { getArticles, deleteArticle } from "@/app/lib/actions/articles";
import {
  showConfirmationToast,
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";

/**
 * Hook for managing articles data and operations
 * Handles:
 * - Data fetching and state management
 * - Pagination
 * - Sorting
 * - Search
 * - CRUD operations
 */
export function useArticles() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
  const [isDeleting, setIsDeleting] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  // URL parameters with defaults
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 5;
  const searchQuery = searchParams.get("query") || "";
  const sortField =
    (searchParams.get("sortField") as keyof Article) || "published_at";
  const sortDirection =
    (searchParams.get("sortDirection") as "asc" | "desc") || "desc";

  // Fetch articles data when dependencies change
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSearching && !isSorting) {
          setIsLoading(true);
        }
        const result = await getArticles({
          page: Number(currentPage),
          limit: Number(itemsPerPage),
          search: searchQuery,
          sortField: String(sortField),
          sortDirection,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        setArticles(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalItems(result.totalCount || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setIsSorting(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, sortField, sortDirection, searchQuery, isSearching, isSorting]);

  // Event handlers
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/dashboard/articles?${params.toString()}`);
  };

  const handleSort = (field: keyof Article) => {
    setIsSorting(true);
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/articles?${params.toString()}`);
  };

  const handleEdit = (article: Article) => {
    router.push(`/dashboard/articles/${article.id}/edit`);
  };

  const handleDelete = async (article: Article) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Article",
        message:
          "Are you sure you want to delete this article? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const success = await deleteArticle(Number(article.id));

      if (!success) {
        throw new Error("Failed to delete article");
      }

      // Force a router refresh to ensure we get fresh data
      router.refresh();

      // Refresh the data after successful deletion
      const result = await getArticles({
        page: Number(currentPage),
        limit: Number(itemsPerPage),
        search: searchQuery,
        sortField: String(sortField),
        sortDirection,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // Update the state with the new data
      setArticles(result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotalItems(result.totalCount || 0);

      // If we're on the last page and it's now empty, go to the previous page
      if (result.data?.length === 0 && currentPage > 1) {
        const newPage = currentPage - 1;
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`/dashboard/articles?${params.toString()}`);
      }

      showSuccessToast({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting article:", error);
      showErrorToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete article. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
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
    router.push(`/dashboard/articles?${params.toString()}`);
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", limit.toString());
    router.push(`/dashboard/articles?${params.toString()}`);
  };

  return {
    articles,
    totalPages,
    totalItems,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    searchQuery,
    isDeleting,
    isLoading,
    isSearching,
    isSorting,
    handlePageChange,
    handleSort,
    handleEdit,
    handleDelete,
    handleSearch,
    handleItemsPerPageChange,
  };
}
