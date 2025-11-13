"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Category } from "@/app/lib/definition";
import { getCategories } from "@/app/lib/actions/categories";
import { useRouter, useSearchParams } from "next/navigation";
import { showErrorToast } from "@/app/components/dashboard/shared/toast/Toast";

// Component Info
// Description: Client state manager for dashboard categories table interactions.
// Data created: Local pagination, sorting, and search state synced with server data.
// Author: thangtruong

interface CategoriesStateProps {
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
    handlePageChange: (_page: number) => void;
    handleSort: (_field: keyof Category) => void;
    handleEdit: (_category: Category) => void;
    handleDelete: (_id: number, _name: string) => void;
    handleSearch: (_term: string) => void;
    handleItemsPerPageChange: (_limit: number) => void;
  }) => React.ReactNode;
}

export default function CategoriesState({ children }: CategoriesStateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(Number(searchParams.get("limit")) || 10);
  const [sortField, setSortField] = useState((searchParams.get("sortField") as keyof Category) || "created_at");
  const [sortDirection, setSortDirection] = useState((searchParams.get("sortDirection") as "asc" | "desc") || "desc");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    const result = await getCategories({
      page: currentPage,
      limit: itemsPerPage,
      sortField,
      sortDirection,
      search: searchQuery,
    });

    if (result.error) {
      showErrorToast({ message: result.error });
      setCategories([]);
      setTotalPages(1);
      setTotalItems(0);
      setIsLoading(false);
      return;
    }

    setCategories(result.data ?? []);
    setTotalPages(result.totalPages);
    setTotalItems(result.totalItems);
    setIsLoading(false);
  }, [currentPage, itemsPerPage, sortField, sortDirection, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePageChange = (_page: number) => {
    setCurrentPage(_page);
  };

  const handleSort = (_field: keyof Category) => {
    setSortField(_field);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleEdit = (category: Category) => {
    router.push(`/dashboard/categories/${category.id}/edit`);
  };

  const handleDelete = (_id: number, _name: string) => {
    // TODO: Implement delete functionality
    setIsDeleting(true);
    setIsDeleting(false);
  };

  const handleSearch = (_term: string) => {
    setSearchQuery(_term);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (_limit: number) => {
    setItemsPerPage(_limit);
    setCurrentPage(1);
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
