"use client";

import { Table } from "@/app/components/dashboard/shared/table";
import { Tag } from "@/app/lib/definition";
import type { Column } from "@/app/components/dashboard/shared/table/TableTypes";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";
import { formatDateWithMonth } from "@/app/lib/utils/dateFormatter";
import { useSession } from "next-auth/react";

/* eslint-disable no-unused-vars */
interface TagsTableProps {
  tags: Tag[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  sortField: keyof Tag;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  isDeleting: boolean;
  isLoading: boolean;
  onSort: ({ field }: { field: keyof Tag | "sequence" }) => void;
  onPageChange: ({ page }: { page: number }) => void;
  onEdit: ({ item }: { item: Tag }) => void;
  onDelete: ({ item }: { item: Tag }) => void;
  onItemsPerPageChange: ({ limit }: { limit: number }) => void;
}
/* eslint-enable no-unused-vars */

// Component Info
// Description: Render dashboard tags table with admin actions, pagination, and formatted metadata columns.
// Date created: 2025-11-18
// Author: thangtruong

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
  const baseColumns: Column<Tag & { sequence: number }>[] = [
    {
      field: "sequence",
      label: "#",
      sortable: false,
      render: ({ value }) => (
        <span className="text-sm text-gray-500">
          {typeof value === "number" ? value : Number(value ?? 0)}
        </span>
      ),
    },
    {
      field: "name",
      label: "Name",
      sortable: true,
      render: ({ value }) => (
        <div className="w-48">
          <ExpandableContent
            content={String(value ?? "")}
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
      render: ({ value }) => (
        <div className="w-64">
          <ExpandableContent
            content={
              typeof value === "string" && value.length > 0
                ? value
                : "No description"
            }
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
      render: ({ value }) => {
        const total =
          typeof value === "number"
            ? value
            : Number.parseInt(String(value ?? 0), 10);
        return (
        <div className="w-20">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {Number.isNaN(total) ? 0 : total}
          </span>
        </div>
        );
      },
    },
    {
      field: "categories_count",
      label: "Categories",
      sortable: true,
      render: ({ value }) => {
        const total =
          typeof value === "number"
            ? value
            : Number.parseInt(String(value ?? 0), 10);
        return (
        <div className="w-20">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {Number.isNaN(total) ? 0 : total}
          </span>
        </div>
        );
      },
    },
    {
      field: "subcategories_count",
      label: "Subcategories",
      sortable: true,
      render: ({ value }) => {
        const total =
          typeof value === "number"
            ? value
            : Number.parseInt(String(value ?? 0), 10);
        return (
        <div className="w-20">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {Number.isNaN(total) ? 0 : total}
          </span>
        </div>
        );
      },
    },
    {
      field: "color",
      label: "Color",
      sortable: true,
      render: ({ value }) => (
        <div className="flex items-center space-x-2">
          {typeof value === "string" && value.length > 0 && (
            <div
              className="h-4 w-4 rounded-full border border-gray-300"
              style={{ backgroundColor: value }}
            />
          )}
          <span className="text-sm text-gray-500">
            {typeof value === "string" && value.length > 0
              ? value
              : "No color"}
          </span>
        </div>
      ),
    },
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
      render: ({ value }) => (
        <div className="w-32">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {formatDateWithMonth(String(value ?? ""))}
          </span>
        </div>
      ),
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
      render: ({ value }) => (
        <div className="w-32">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {formatDateWithMonth(String(value ?? ""))}
          </span>
        </div>
      ),
    },
  ];

  // Actions column header (buttons are rendered automatically by TableRow)
  const columns = isAdmin
    ? [
        ...baseColumns,
        {
          field: "actions" as keyof (Tag & { sequence: number }),
          label: "Actions",
          sortable: false,
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
        onSort={({ field }) => onSort({ field })}
        onPageChange={({ page }) => onPageChange({ page })}
        onEdit={({ item }) => onEdit({ item })}
        onDelete={({ item }) => onDelete({ item })}
        isDeleting={isDeleting}
        onItemsPerPageChange={({ limit }) => onItemsPerPageChange({ limit })}
        searchQuery={searchQuery}
        isLoading={isLoading}
      />
    </div>
  );
}
