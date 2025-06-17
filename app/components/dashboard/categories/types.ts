import { Category } from "@/app/lib/definition";

export interface Column<T> {
  field: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableHeaderProps {
  columns: Column<Category>[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (_field: string) => void;
}

export interface TableBodyProps {
  columns: Column<Category>[];
  data: Category[];
  onEdit: (_category: Category, _index: number) => void;
  onDelete: (_category: Category, _index: number) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (_page: number) => void;
}

export interface CategoriesTableProps {
  categories: Category[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof Category;
  sortDirection: "asc" | "desc";
  isDeleting: boolean;
  isLoading: boolean;
  onSort: (_field: keyof Category) => void;
  onPageChange: (_page: number) => void;
  onEdit: (_category: Category) => void;
  onDelete: (_id: number, _categoryName: string) => void;
  onSearch: (_term: string) => void;
  onItemsPerPageChange: (_limit: number) => void;
}

export interface CategoriesTableClientProps {
  categories: Category[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof Category;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  isDeleting: boolean;
  isLoading: boolean;
  onSort: (_field: keyof Category) => void;
  onPageChange: (_page: number) => void;
  onEdit: (_category: Category) => void;
  onDelete: (_id: number, _categoryName: string) => void;
  onSearch: (_term: string) => void;
  onItemsPerPageChange: (_limit: number) => void;
}

export interface MobileCategoryCardProps {
  category: Category;
  onEdit: (_category: Category) => void;
  onDelete: (_id: number, _categoryName: string) => void;
}

export interface TableColumn {
  field: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
}

export interface TableRowProps {
  item: Category;
  columns: TableColumn[];
  onEdit: (_category: Category) => void;
  onDelete: (_id: number, _categoryName: string) => void;
}
