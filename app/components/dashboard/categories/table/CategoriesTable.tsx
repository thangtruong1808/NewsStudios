"use client";

import { Table, Column } from "@/app/components/dashboard/shared/table";
import { Category } from "@/app/lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";

interface CategoriesTableProps {
  categories: Category[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  sortField: keyof Category;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Category) => void;
  onPageChange: (page: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isDeleting: boolean;
  searchQuery: string;
  isLoading: boolean;
  onItemsPerPageChange?: (limit: number) => void;
}

export default function CategoriesTable({
  categories,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  sortField,
  sortDirection,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  isDeleting,
  searchQuery,
  isLoading,
  onItemsPerPageChange,
}: CategoriesTableProps) {
  const columns: Column<Category & { sequence?: number; actions?: never }>[] = [
    {
      field: "sequence",
      label: "#",
      sortable: false,
      render: (value) => <span className="text-sm text-gray-500">{value}</span>,
    },
    {
      field: "name",
      label: "Name",
      sortable: true,
      render: (value) => <span className="text-sm text-gray-500">{value}</span>,
    },
    {
      field: "description",
      label: "Description",
      sortable: true,
      render: (value) => (
        <div className="w-64">
          <ExpandableContent
            content={value || "No description"}
            maxWords={12}
            className="text-sm text-gray-500"
          />
        </div>
      ),
    },
    {
      field: "subcategories_count",
      label: "Subcategories",
      sortable: true,
      render: (value) => (
        <div className="w-24">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      field: "articles_count",
      label: "Articles",
      sortable: true,
      render: (value) => (
        <div className="w-24">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
      render: (value) => (
        <div className="w-32">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
      render: (value) => (
        <div className="w-32">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      field: "actions",
      label: "Actions",
      sortable: false,
      render: (_, category) => (
        <div className="flex justify-start items-start space-x-2">
          <button
            onClick={() => onEdit(category)}
            className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(category)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={categories}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      sortField={sortField}
      sortDirection={sortDirection}
      onSort={onSort}
      onPageChange={onPageChange}
      onItemsPerPageChange={onItemsPerPageChange}
      onEdit={onEdit}
      onDelete={onDelete}
      isDeleting={isDeleting}
      searchQuery={searchQuery}
      isLoading={isLoading}
    />
  );
}
