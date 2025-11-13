"use client";

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
  isDeleting: boolean;
  onSort: (field: keyof Category) => void;
  onPageChange: (page: number) => void;
  onDelete: (id: number, name: string) => void;
}

// Description: Render responsive categories table with desktop grid, mobile cards, and pagination controls.
// Data created: 2024-11-13
// Author: thangtruong
export function CategoriesTable({
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
}: CategoriesTableProps) {
  const columns = useTableColumns({ isDeleting, onDelete });

  const handleSort = (field: string) => {
    onSort(field as keyof Category);
  };

  return (
    <div className="space-y-4">
      {/* Desktop table */}
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

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {categories.map((category) => (
          <MobileCategoryCard
            key={category.id}
            category={category}
            onEdit={undefined}
            onDelete={() => onDelete(category.id, category.name)}
          />
        ))}
      </div>

      {/* Pagination footer */}
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