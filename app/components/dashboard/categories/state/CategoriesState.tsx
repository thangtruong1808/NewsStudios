"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Category } from "@/app/lib/definition";
import { getCategories } from "@/app/lib/actions/categories";
import { useRouter, useSearchParams } from "next/navigation";
import { showErrorToast } from "@/app/components/dashboard/shared/toast/Toast";

// Description: Manage dashboard categories table state including pagination, sorting, and filters.
// Data created: 2024-11-13
// Author: thangtruong

/* eslint-disable no-unused-vars */
interface CategoriesStateRenderProps {
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
  handlePageChange({ page }: { page: number }): void;
  handleSort({ field }: { field: keyof Category }): void;
  handleEdit({ item }: { item: Category }): void;
  handleDelete({ item }: { item: Category }): void;
  handleSearch({ term }: { term: string }): void;
  handleItemsPerPageChange({ limit }: { limit: number }): void;
}

interface CategoriesStateProps {
  children: (_props: CategoriesStateRenderProps) => React.ReactNode;
}
/* eslint-enable no-unused-vars */

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

  const handlePageChange = ({ page }: { page: number }) => {
    setCurrentPage(page);
  };

  const handleSort = ({ field }: { field: keyof Category }) => {
    setSortField(field);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleEdit = ({ item }: { item: Category }) => {
    router.push(`/dashboard/categories/${item.id}/edit`);
  };

  const handleDelete = ({ item }: { item: Category }) => {
    // TODO: Implement delete functionality
    void item;
    setIsDeleting(true);
    setIsDeleting(false);
  };

  const handleSearch = ({ term }: { term: string }) => {
    setSearchQuery(term);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = ({ limit }: { limit: number }) => {
    setItemsPerPage(limit);
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
