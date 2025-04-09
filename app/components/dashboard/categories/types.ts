import { Category } from "../../../type/definitions";
import { ReactNode } from "react";

export interface Column {
  key: string;
  label: string;
  sortable: boolean;
  cell: (category: Category, index: number) => ReactNode;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export interface TableHeaderProps {
  columns: Column[];
  sortField: keyof Category | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Category) => void;
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
