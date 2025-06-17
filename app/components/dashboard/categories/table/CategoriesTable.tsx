"use client";

import { Category } from "@/app/lib/definition";
import { useTableColumns } from "../hooks/useTableColumns";
import { TableHeader, TableBody } from "@/app/components/dashboard/shared/table";
import Pagination from "@/app/components/dashboard/shared/pagination/Pagination";
import MobileCategoryCard from "../MobileCategoryCard";

interface CategoriesTableProps {
  categories: Category[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof Category;
  sortDirection: "asc" | "desc";
  onSort: (_field: keyof Category) => void;
  onPageChange: (_page: number) => void;
  onDelete: (_category: Category) => void;
  isDeleting: boolean;
  searchQuery: string;
  isLoading: boolean;
  onSearch: (_category: Category) => void;
}

export function CategoriesTable({
  categories,
  totalPages,
  totalItems,
  currentPage,
  itemsPerPage,
  sortField,
  sortDirection,
  onSort,
  onPageChange,
  onDelete,
  isDeleting,
  searchQuery,
  isLoading,
  onSearch,
}: CategoriesTableProps) {
  const columns = useTableColumns({ isDeleting, onDelete });

  return (
    <div className="mt-8">
      <div className="sm:hidden">
        <MobileCategoryCard
          categories={categories}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      </div>

      <div className="hidden sm:block">
        <TableHeader
          columns={columns}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <TableBody
          columns={columns}
          data={categories}
          isLoading={isLoading}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={(_limit: number) => {
          // Handle items per page change
        }}
      />
    </div>
  );
}
