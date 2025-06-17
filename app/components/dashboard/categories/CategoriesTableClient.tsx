"use client";

declare global {
  interface Window {
    confirm: (message?: string) => boolean;
  }
}

import { useState, useEffect } from "react";
import { Category } from "@/app/lib/definition";
import { useTableColumns } from "./hooks/useTableColumns";
import { TableHeader } from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import { toast } from "react-hot-toast";
import { deleteCategory } from "@/app/lib/actions/categories";
import { useRouter, useSearchParams } from "next/navigation";
import MobileCategoryCard from "./MobileCategoryCard";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CategoriesTable } from "./CategoriesTable";

interface CategoriesTableClientProps {
  categories: Category[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof Category;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  isDeleting: boolean;
  isLoading: boolean;
  onSort: (field: keyof Category) => void;
  onPageChange: (page: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: number, name: string) => void;
  onSearch: (term: string) => void;
  onItemsPerPageChange: (limit: number) => void;
}

export default function CategoriesTableClient({
  categories,
  totalPages,
  totalItems,
  currentPage,
  itemsPerPage,
  sortField,
  sortDirection,
  searchQuery,
  isDeleting,
  isLoading,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  onSearch,
  onItemsPerPageChange,
}: CategoriesTableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const columns = useTableColumns({ isDeleting, onDelete });

  const handleSort = (_field: keyof Category) => {
    onSort(_field);
  };

  const handlePageChange = (_page: number) => {
    onPageChange(_page);
  };

  const handleSearch = (term: string) => {
    onSearch(term);
  };

  return (
    <div className="mt-8">
      <CategoriesTable
        categories={categories}
        totalPages={totalPages}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onDelete={onDelete}
        isDeleting={isDeleting}
        searchQuery={searchQuery}
        isLoading={isLoading}
        onSearch={handleSearch}
      />
    </div>
  );
}
