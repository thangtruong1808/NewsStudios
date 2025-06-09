"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/app/lib/definition";
import { getCategories, deleteCategory } from "@/app/lib/actions/categories";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";

export interface CategoriesStateProps {
  children: (props: {
    categories: Category[];
    totalPages: number;
    totalItems: number;
    isLoading: boolean;
    isDeleting: boolean;
    currentPage: number;
    itemsPerPage: number;
    sortField: keyof Category;
    sortDirection: "asc" | "desc";
    searchQuery: string;
    handlePageChange: (page: number) => void;
    handleSort: (field: keyof Category) => void;
    handleEdit: (category: Category) => void;
    handleDelete: (category: Category) => void;
    handleSearch: (term: string) => void;
    handleItemsPerPageChange: (limit: number) => void;
  }) => React.ReactNode;
}

export default function CategoriesState({ children }: CategoriesStateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
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
    (searchParams.get("sortField") as keyof Category) || "created_at";
  const sortDirection =
    (searchParams.get("sortDirection") as "asc" | "desc") || "desc";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSearching && !isSorting) {
          setIsLoading(true);
        }
        const { data, totalItems, totalPages } = await getCategories({
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          sortField: sortField as string,
          sortDirection,
        });

        setCategories(data || []);
        setTotalPages(totalPages);
        setTotalItems(totalItems);
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
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  const handleSort = (field: keyof Category) => {
    setIsSorting(true);
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  const handleEdit = (category: Category) => {
    router.push(`/dashboard/categories/${category.id}/edit`);
  };

  const handleDelete = async (category: Category) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Category",
        message:
          "Are you sure you want to delete this category? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const { error } = await deleteCategory(category.id);

      if (error) {
        showErrorToast({ message: error });
        return;
      }

      // Refresh the categories data
      const { data, totalItems, totalPages } = await getCategories({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        sortField: sortField as string,
        sortDirection,
      });

      setCategories(data || []);
      setTotalPages(totalPages);
      setTotalItems(totalItems);

      router.refresh();
      showSuccessToast({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      showErrorToast({
        message: "Failed to delete category. Please try again.",
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
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", limit.toString());
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  return (
    <>
      {children({
        categories,
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
