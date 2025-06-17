"use client";

import Table from "@/app/components/dashboard/shared/table/Table";
import type { Column } from "@/app/components/dashboard/shared/table/TableTypes";
import { Category } from "@/app/lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";
import { formatDateWithMonth } from "@/app/lib/utils/dateFormatter";
import { useSession } from "next-auth/react";

interface CategoriesTableProps {
  categories: Category[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  sortField: keyof Category;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  isDeleting: boolean;
  isLoading: boolean;
  onSort: (field: keyof Category) => void;
  onPageChange: (page: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: number, name: string) => void;
  onItemsPerPageChange: (limit: number) => void;
}

export function CategoriesTable({
  categories,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  sortField,
  sortDirection,
  searchQuery,
  isDeleting,
  isLoading,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  onItemsPerPageChange,
}: CategoriesTableProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

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
      render: (value: string) => (
        <div className="w-64">
          <ExpandableContent
            content={value || "No description"}
            maxWords={10}
            className="text-sm text-gray-500"
          />
        </div>
      ),
    },
    {
      field: "subcategories_count",
      label: "Subcategories",
      sortable: true,
      render: (value: string) => (
        <div className="w-20">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {parseInt(value) || 0}
          </span>
        </div>
      ),
    },
    {
      field: "articles_count",
      label: "Articles",
      sortable: true,
      render: (value: string) => (
        <div className="w-20">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {parseInt(value) || 0}
          </span>
        </div>
      ),
    },
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
      render: (value: string) => (
        <div className="w-32">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {formatDateWithMonth(value)}
          </span>
        </div>
      ),
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
      render: (value: string) => (
        <div className="w-32">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {formatDateWithMonth(value)}
          </span>
        </div>
      ),
    },
  ];

  // Only add the actions column if the user is an admin
  if (isAdmin) {
    columns.push({
      field: "actions",
      label: "Actions",
      sortable: false,
      render: (_: unknown, category: Category) => (
        <div className="flex justify-start items-start space-x-2">
          <button
            onClick={() => onEdit(category)}
            className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(category.id, category.name)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      ),
    });
  }

  return (
    <div className="">
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
        onEdit={onEdit}
        onDelete={(category) => onDelete(category.id, category.name)}
        isDeleting={isDeleting}
        searchQuery={searchQuery}
        isLoading={isLoading}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
}
