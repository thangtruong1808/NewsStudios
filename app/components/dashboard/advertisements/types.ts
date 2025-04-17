import { Advertisement } from "../../../lib/definition";
import { ReactNode } from "react";

export type SortDirection = "asc" | "desc";

export interface Column {
  key: keyof Advertisement | "sequence" | "actions";
  label: string;
  sortable?: boolean;
  render?: (item: Advertisement, index: number) => React.ReactNode;
  cell?: (item: Advertisement, index: number) => React.ReactNode;
}

export interface TableHeaderProps {
  columns: Column[];
  sortField: string;
  sortDirection: SortDirection;
  onSort: (field: string) => void;
}

export interface TableRowProps {
  item: Advertisement;
  columns: Column[];
  index: number;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export interface TableBodyProps {
  advertisements: Advertisement[];
  columns: Column[];
  currentPage: number;
  itemsPerPage: number;
}

export interface DeleteAdvertisementButtonProps {
  advertisementId: number;
  advertisementType: string;
  onDelete: (id: number, adType: string) => Promise<void>;
  isDeleting: boolean;
}

export interface MobileAdvertisementCardProps {
  advertisement: Advertisement;
  onEdit: (id: number) => void;
  onDelete: (id: number, adType: string) => Promise<void>;
  isDeleting: boolean;
}
