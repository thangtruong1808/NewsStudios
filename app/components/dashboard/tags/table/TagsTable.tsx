"use client";

import { Table } from "@/app/components/dashboard/shared/table";
import { Tag } from "@/app/lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Column } from "@/app/components/dashboard/shared/table/TableTypes";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";
import { formatDateWithMonth } from "@/app/lib/utils/dateFormatter";
import { useSession } from "next-auth/react";

interface TagsTableProps {
  tags: Tag[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  sortField: keyof (Tag & { sequence?: number });
  sortDirection: "asc" | "desc";
  searchQuery: string;
  isDeleting: boolean;
  isLoading: boolean;
  onSort: (field: keyof (Tag & { sequence?: number })) => void;
  onPageChange: (page: number) => void;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
  onItemsPerPageChange: (limit: number) => void;
}

export default function TagsTable({
  tags,
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
}: TagsTableProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  // Define table columns with sorting and rendering options
  const baseColumns: Column<Tag & { sequence?: number }>[] = [
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
      render: (value) => (
        <div className="w-48">
          <ExpandableContent
            content={value}
            maxWords={5}
            className="text-sm text-gray-500"
          />
        </div>
      ),
    },
    {
      field: "description",
      label: "Description",
      sortable: true,
      render: (value) => (
        <div className="w-64">
          <ExpandableContent
            content={value || "No description"}
            maxWords={5}
            className="text-sm text-gray-500"
          />
        </div>
      ),
    },
    {
      field: "articles_count",
      label: "Articles",
      sortable: true,
      render: (value) => (
        <div className="w-20">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      field: "categories_count",
      label: "Categories",
      sortable: true,
      render: (value) => (
        <div className="w-20">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      field: "subcategories_count",
      label: "Subcategories",
      sortable: true,
      render: (value) => (
        <div className="w-20">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      field: "color",
      label: "Color",
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          {value && (
            <div
              className="h-4 w-4 rounded-full border border-gray-300"
              style={{ backgroundColor: value }}
            />
          )}
          <span className="text-sm text-gray-500">{value || "No color"}</span>
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
            {formatDateWithMonth(value)}
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
            {formatDateWithMonth(value)}
          </span>
        </div>
      ),
    },
  ];

  // Add actions column only for admin users
  const columns = isAdmin
    ? [
        ...baseColumns,
        {
          field: "actions" as keyof (Tag & { sequence?: number }),
          label: "Actions",
          sortable: false,
          render: (_: unknown, tag: Tag) => (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(tag)}
                className="text-blue-600 hover:text-blue-800"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(tag)}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ),
        },
      ]
    : baseColumns;

  // Add sequence numbers to tags
  const tagsWithSequence = tags.map((tag, index) => ({
    ...tag,
    sequence: (currentPage - 1) * itemsPerPage + index + 1,
  }));

  return (
    <div className="">
      <Table
        data={tagsWithSequence}
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
        onDelete={onDelete}
        isDeleting={isDeleting}
        onItemsPerPageChange={onItemsPerPageChange}
        searchQuery={searchQuery}
        isLoading={isLoading}
      />
    </div>
  );
}
