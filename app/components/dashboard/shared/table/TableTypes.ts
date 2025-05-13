import { ReactNode } from "react";

export interface Column<T> {
  field: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchQuery?: string;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  sortField: keyof T;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof T) => void;
  onPageChange: (page: number) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
}

export interface TableViewProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  itemsPerPage: number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isDeleting?: boolean;
}
