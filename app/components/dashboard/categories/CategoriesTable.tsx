"use client";

import React from "react";
import { Category } from "@/app/lib/definition";
import { TableHeader } from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import MobileCategoryCard from "./MobileCategoryCard";
import { useTableColumns } from "./hooks/useTableColumns";

interface CategoriesTableProps {
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
  onDelete: (id: number, name: string) => void;
  onSearch: (term: string) => void;
}

export function CategoriesTable({
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
  onDelete,
  onSearch,
}: CategoriesTableProps) {
  const columns = useTableColumns({ isDeleting, onDelete });

  const handleSort = (field: string) => {
    onSort(field as keyof Category);
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader
              columns={columns}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableBody
              categories={categories}
              columns={columns}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {categories.map((category) => (
          <MobileCategoryCard
            key={category.id}
            category={category}
            onEdit={() => { }}
            onDelete={() => onDelete(category.id, category.name)}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
} 