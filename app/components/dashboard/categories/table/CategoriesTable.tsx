"use client";

import { Table } from "@/app/components/dashboard/shared/table";
import { Category } from "@/app/lib/definition";
import { useTableColumns } from "./TableColumns";
import { useSession } from "next-auth/react";

interface CategoriesTableProps {
  categories: Category[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  sortField: keyof Category;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Category) => void;
  onPageChange: (page: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isDeleting: boolean;
  searchQuery: string;
  isLoading: boolean;
  onItemsPerPageChange?: (limit: number) => void;
}

export default function CategoriesTable({
  categories,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  sortField,
  sortDirection,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  isDeleting,
  searchQuery,
  isLoading,
  onItemsPerPageChange,
}: CategoriesTableProps) {
  const { data: session } = useSession();
  const columns = useTableColumns();

  return (
    <Table
      data={categories}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      sortField={sortField}
      sortDirection={sortDirection}
      onSort={onSort}
      onPageChange={onPageChange}
      onItemsPerPageChange={onItemsPerPageChange}
      onEdit={session?.user?.role === "admin" ? onEdit : undefined}
      onDelete={session?.user?.role === "admin" ? onDelete : undefined}
      isDeleting={isDeleting}
      searchQuery={searchQuery}
      isLoading={isLoading}
    />
  );
}
