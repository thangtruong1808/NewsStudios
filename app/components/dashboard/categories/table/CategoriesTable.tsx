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
  searchQuery: string;
  isDeleting: boolean;
  isLoading: boolean;
  onSort: (_field: keyof Category) => void;
  onPageChange: (_page: number) => void;
  onEdit: (_category: Category) => void;
  onDelete: (_id: number, _name: string) => void;
  onItemsPerPageChange: (_limit: number) => void;
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
  onEdit,
  onDelete,
  onItemsPerPageChange,
}: CategoriesTableProps) {
  const columns = useTableColumns({ isDeleting, onDelete });

  return (
    <div className="mt-8">
      <div className="sm:hidden">
        {categories.map((category) => (
          <MobileCategoryCard
            key={category.id}
            category={category}
            onEdit={onEdit}
            onDelete={(category) => onDelete(category.id, category.name)}
          />
        ))}
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
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
}
