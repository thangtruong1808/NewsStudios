import { Category } from "@/app/lib/definition";
import { ReactNode } from "react";

export interface Column {
  field: string;
  label: string;
  sortable: boolean;
  render?: (_category: Category, _index: number) => React.ReactNode;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (_page: number) => void;
}

export interface TableProps {
  columns: Column[];
  data: Category[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (_field: string) => void;
  onPageChange: (_page: number) => void;
  onItemsPerPageChange?: (_limit: number) => void;
  onEdit?: (_category: Category) => void;
  onDelete?: (_id: number, _categoryName: string) => void;
  isDeleting?: boolean;
  searchQuery?: string;
  isLoading?: boolean;
}

export interface MobileCategoryCardProps {
  category: Category;
  onDelete: (_id: number, _categoryName: string) => void;
  isDeleting: boolean;
}

export interface TableHeaderProps {
  columns: Column[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export interface TableRowProps {
  category: Category;
  columns: Column[];
  index: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface TableBodyProps {
  categories: Category[];
  columns: Column[];
  currentPage: number;
  itemsPerPage: number;
}

export interface DeleteCategoryButtonProps {
  categoryId: number;
  categoryName: string;
  onDelete: (id: number, categoryName: string) => Promise<void>;
  isDeleting: boolean;
}
