"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/app/lib/definition";
import { getCategories, deleteCategory } from "@/app/lib/actions/categories";
import { useRouter, useSearchParams } from "next/navigation";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";

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
    handleDelete: (_category: Category) => void;
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
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 10;
  const sortField = (searchParams.get("sortField") as keyof Category) || "created_at";
  const sortDirection = (searchParams.get("sortDirection") as "asc" | "desc") || "desc";
  const searchQuery = searchParams.get("search") || "";

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data, totalItems, totalPages } = await getCategories({
        page: currentPage,
        limit: itemsPerPage,
        sortField,
        sortDirection,
        search: searchQuery,
      });

      if (data) {
        setCategories(data);
        setTotalPages(totalPages);
        setTotalItems(totalItems);
      }
    } catch (error) {
      showErrorToast({ message: "Failed to fetch categories" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, itemsPerPage, sortField, sortDirection, searchQuery, isSearching, isSorting]);

  const handlePageChange = (_page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", _page.toString());
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  const handleSort = (_field: keyof Category) => {
    const params = new URLSearchParams(searchParams.toString());
    const newDirection = sortField === _field && sortDirection === "asc" ? "desc" : "asc";
    params.set("sortField", _field);
    params.set("sortDirection", newDirection);
    setIsSorting(true);
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  const handleEdit = (_category: Category) => {
    router.push(`/dashboard/categories/${_category.id}/edit`);
  };

  const handleDelete = async (_category: Category) => {
    if (!window.confirm(`Are you sure you want to delete ${_category.name}?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await deleteCategory(_category.id);
      if (error) {
        showErrorToast({ message: error });
        return;
      }
      showSuccessToast({ message: "Category deleted successfully" });
      fetchCategories();
    } catch (error) {
      showErrorToast({ message: "Failed to delete category" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = (_term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", _term);
    params.set("page", "1");
    setIsSearching(true);
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  const handleItemsPerPageChange = (_limit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", _limit.toString());
    params.set("page", "1");
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
