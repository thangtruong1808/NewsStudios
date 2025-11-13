import type { ReactNode } from "react";

// Description: Shared table type contracts covering columns, table props, and responsive view props.
// Data created: 2024-11-13
// Author: thangtruong
export interface Column<T> {
  field: keyof T;
  label: string;
  sortable?: boolean;
  render?: (params: { value: T[keyof T]; row: T }) => ReactNode;
}

export interface TableProps<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  currentPage?: number;
  itemsPerPage?: number;
  totalPages?: number;
  totalItems?: number;
  sortField?: keyof T;
  sortDirection?: "asc" | "desc";
  onSort?: (params: { field: keyof T }) => void;
  onPageChange?: (params: { page: number }) => void;
  onItemsPerPageChange?: (params: { limit: number }) => void;
  onEdit?: (params: { item: T }) => void;
  onDelete?: (params: { item: T }) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  searchQuery?: string;
}

export interface ViewProps<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (params: { item: T }) => void;
  onDelete?: (params: { item: T }) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  searchQuery?: string;
}
