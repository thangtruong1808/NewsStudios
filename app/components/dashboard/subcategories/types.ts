import { SubCategory } from "../../../lib/definition";
import { ReactNode } from "react";

export interface Column {
  key: string;
  label: string;
  sortable: boolean;
  cell: (subcategory: SubCategory, index: number) => ReactNode;
}

export interface TableHeaderProps {
  columns: Column[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export interface TableBodyProps {
  subcategories: SubCategory[];
  columns: Column[];
  currentPage: number;
  itemsPerPage: number;
}
