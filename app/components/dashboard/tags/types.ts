import { Tag } from "../../../login/login-definitions";
import { ReactNode } from "react";

export interface Column {
  key: string;
  label: string;
  sortable: boolean;
  cell: (
    tag: Tag,
    index: number,
    currentPage: number,
    itemsPerPage: number
  ) => ReactNode;
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
  sortField: keyof Tag | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Tag) => void;
}

export interface TableRowProps {
  tag: Tag;
  columns: Column[];
  index: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface TableBodyProps {
  tags: Tag[];
  columns: Column[];
  currentPage: number;
  itemsPerPage: number;
}

export interface DeleteTagButtonProps {
  tagId: number;
  tagName: string;
  onDelete: (id: number, name: string) => void;
  isDeleting: boolean;
}
