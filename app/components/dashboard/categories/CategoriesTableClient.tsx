"use client";

import { Category } from "@/app/lib/definition";
import { CategoriesTable } from "./CategoriesTable";

interface CategoriesTableClientProps {
  categories: Category[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof Category;
  sortDirection: "asc" | "desc";
  isDeleting: boolean;
  onSort: (field: keyof Category) => void;
  onPageChange: (page: number) => void;
  onDelete: (id: number, name: string) => void;
}

// Description: Bridge server-provided category data into the table component with client handlers.
// Data created: 2024-11-13
// Author: thangtruong
export default function CategoriesTableClient({
  categories,
  totalPages,
  totalItems,
  currentPage,
  itemsPerPage,
  sortField,
  sortDirection,
  isDeleting,
  onSort,
  onPageChange,
  onDelete,
}: CategoriesTableClientProps) {
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
        onSort={onSort}
        onPageChange={onPageChange}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
