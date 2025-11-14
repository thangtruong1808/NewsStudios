/* eslint-disable no-unused-vars */
import type { ReactNode } from "react";

// Description: Shared table type contracts covering columns, table props, and responsive view props.
// Data created: 2024-11-13
// Author: thangtruong
export interface Column<T> {
  field: keyof T | "actions";
  label: string;
  sortable?: boolean;
  render?: ({
    value,
    row,
  }: {
    value: T extends Record<string, unknown>
      ? T[keyof T] | undefined
      : unknown;
    row: T;
  }) => ReactNode;
}

export interface TableProps<T extends { id: number }> {
  data: (T & { sequence?: number })[];
  columns: Column<T & { sequence?: number }>[];
  currentPage?: number;
  itemsPerPage?: number;
  totalPages?: number;
  totalItems?: number;
  sortField?: keyof T;
  sortDirection?: "asc" | "desc";
  onSort?: ({ field }: { field: keyof T }) => void;
  onPageChange?: ({ page }: { page: number }) => void;
  onItemsPerPageChange?: ({ limit }: { limit: number }) => void;
  onEdit?: ({ item }: { item: T }) => void;
  onDelete?: ({ item }: { item: T }) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  searchQuery?: string;
}

export interface ViewProps<T extends { id: number }> {
  data: (T & { sequence?: number })[];
  columns: Column<T & { sequence?: number }>[];
  onEdit?: ({ item }: { item: T }) => void;
  onDelete?: ({ item }: { item: T }) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  searchQuery?: string;
}
/* eslint-enable no-unused-vars */
