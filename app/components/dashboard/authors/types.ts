import { Author } from "../../../login/login-definitions";
import { ReactNode } from "react";

export interface Column {
  key: string;
  label: string;
  sortable: boolean;
  cell: (author: Author, index: number) => ReactNode;
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
  sortField: keyof Author | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Author) => void;
}

export interface TableBodyProps {
  authors: Author[];
  columns: Column[];
  currentPage: number;
  itemsPerPage: number;
}

export interface DeleteAuthorButtonProps {
  authorId: number;
  authorName: string;
  onDelete: (id: number, authorName: string) => Promise<void>;
  isDeleting: boolean;
}
