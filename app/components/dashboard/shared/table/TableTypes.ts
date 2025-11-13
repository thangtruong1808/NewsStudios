import type { ReactNode } from "react";

// Description: Shared table type contracts covering columns, table props, and responsive view props.
// Data created: 2024-11-13
// Author: thangtruong
export interface Column<T> {
  field: keyof T;
  label: string;
  sortable?: boolean;
  render?: (_payload: { value: T[keyof T]; row: T }) => ReactNode;
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
  onSort?: (_payload: { field: keyof T }) => void;
  onPageChange?: (_payload: { page: number }) => void;
  onItemsPerPageChange?: (_payload: { limit: number }) => void;
  onEdit?: (_payload: { item: T }) => void;
  onDelete?: (_payload: { item: T }) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  searchQuery?: string;
}

export interface ViewProps<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (_payload: { item: T }) => void;
  onDelete?: (_payload: { item: T }) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  searchQuery?: string;
}
