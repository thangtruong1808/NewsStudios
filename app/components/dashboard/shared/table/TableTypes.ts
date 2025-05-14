import { ReactNode } from "react";

export interface Column<T> {
  field: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: string, item: T) => React.ReactNode;
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
  onSort?: (field: keyof T) => void;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  searchQuery?: string;
}

export interface ViewProps<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  searchQuery?: string;
}
