"use client";

declare global {
  interface _Window {
    confirm: (_message?: string) => boolean;
  }
}

import { Category } from "@/app/lib/definition";
import { useRouter, useSearchParams } from "next/navigation";
import { useTableColumns } from "./hooks/useTableColumns";
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
  onSort: (_field: keyof Category) => void;
  onPageChange: (_page: number) => void;
  onEdit: (_category: Category) => void;
  onDelete: (_id: number, _name: string) => void;
  onSearch: (_term: string) => void;
  onItemsPerPageChange: (_limit: number) => void;
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
  const _router = useRouter();
  const _searchParams = useSearchParams();
  const _columns = useTableColumns({ isDeleting, onDelete });

  const handleSort = (_field: keyof Category) => {
    onSort(_field);
  };

  const handlePageChange = (_page: number) => {
    onPageChange(_page);
  };

  const handleSearch = (_term: string) => {
    onSearch(_term);
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
