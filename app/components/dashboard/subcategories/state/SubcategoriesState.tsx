"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getSubcategories,
  searchSubcategories,
  deleteSubcategory,
} from "@/app/lib/actions/subcategories";
import { SubCategory } from "@/app/lib/definition";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";

/* eslint-disable no-unused-vars */
interface SubcategoriesStateProps {
  children: (props: {
    subcategories: SubCategory[];
    totalPages: number;
    totalItems: number;
    isLoading: boolean;
    isDeleting: boolean;
    currentPage: number;
    itemsPerPage: number;
    sortField: keyof SubCategory;
    sortDirection: "asc" | "desc";
    searchQuery: string;
    handlePageChange: (page: number) => void;
    handleSort: (field: keyof SubCategory) => void;
    handleEdit: (subcategory: SubCategory) => void;
    handleDelete: (subcategory: SubCategory) => void;
    handleSearch: (term: string) => void;
    handleItemsPerPageChange: (limit: number) => void;
  }) => React.ReactNode;
}
/* eslint-enable no-unused-vars */

// Description: Manage subcategory list state including filters, pagination, and deletion flow.
// Data created: 2024-11-13
// Author: thangtruong
export default function SubcategoriesState({
  children,
}: SubcategoriesStateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  // Extract and parse URL parameters
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 5;
  const searchQuery = searchParams.get("query") || "";
  const sortField =
    (searchParams.get("sortField") as keyof SubCategory) || "created_at";
  const sortDirection =
    (searchParams.get("sortDirection") as "asc" | "desc") || "desc";

  // Fetch data when dependencies change
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSearching && !isSorting) {
          setIsLoading(true);
        }
        const result = searchQuery
          ? await searchSubcategories(
              searchQuery,
              currentPage,
              itemsPerPage,
              sortField,
              sortDirection
            )
          : await getSubcategories({
              page: currentPage,
              limit: itemsPerPage,
              sortField,
              sortDirection,
            });

        setSubcategories(result.data || []);
        if (result.total !== undefined) {
          setTotalPages(Math.ceil(result.total / itemsPerPage));
          setTotalItems(result.total);
        }
      } catch (error) {
        showErrorToast({
          message:
            error instanceof Error
              ? error.message
              : "Failed to load subcategories.",
        });
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setIsSorting(false);
      }
    };

    fetchData();
  }, [
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    searchQuery,
    isSearching,
    isSorting,
  ]);

  // Handler functions
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/dashboard/subcategories?${params.toString()}`);
  };

  const handleSort = (field: keyof SubCategory) => {
    setIsSorting(true);
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/subcategories?${params.toString()}`);
  };

  const handleEdit = (subcategory: SubCategory) => {
    router.push(`/dashboard/subcategories/${subcategory.id}/edit`);
  };

  const handleDelete = async (subcategory: SubCategory) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Subcategory",
        message:
          "Are you sure you want to delete this subcategory? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const { success, error } = await deleteSubcategory(subcategory.id);

      if (!success) {
        throw new Error(error || "Failed to delete subcategory");
      }

      // Refresh the data after successful deletion
      const result = searchQuery
        ? await searchSubcategories(
            searchQuery,
            currentPage,
            itemsPerPage,
            sortField,
            sortDirection
          )
        : await getSubcategories({
            page: currentPage,
            limit: itemsPerPage,
            sortField,
            sortDirection,
          });

      setSubcategories(result.data || []);
      if (result.total !== undefined) {
        setTotalPages(Math.ceil(result.total / itemsPerPage));
        setTotalItems(result.total);
      }

      showSuccessToast({ message: "Subcategory deleted successfully" });
    } catch (error) {
      showErrorToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete subcategory. Please try again.",
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
    router.push(`/dashboard/subcategories?${params.toString()}`);
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", limit.toString());
    router.push(`/dashboard/subcategories?${params.toString()}`);
  };

  return (
    <>
      {children({
        subcategories,
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
