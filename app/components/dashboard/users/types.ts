import { User } from "../../../type/definitions";
import { ReactNode } from "react";

export interface Column {
  key: string;
  label: string;
  sortable: boolean;
  accessor: keyof User;
  cell: (value: string | number, index: number, user: User) => ReactNode;
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
  sortField: keyof User | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof User) => void;
}

export interface TableRowProps {
  user: User;
  columns: Column[];
  index: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface TableBodyProps {
  users: User[];
  columns: Column[];
  currentPage: number;
  itemsPerPage: number;
}

export interface DeleteUserButtonProps {
  userId: number;
  userName: string;
  onDelete: (id: number, userName: string) => Promise<void>;
  isDeleting: boolean;
}
