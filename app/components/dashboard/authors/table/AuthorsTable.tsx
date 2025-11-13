"use client";

import Table from "@/app/components/dashboard/shared/table/Table";
import type { Column } from "@/app/components/dashboard/shared/table/TableTypes";
import { Author } from "@/app/lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";
import { formatDateWithMonth } from "@/app/lib/utils/dateFormatter";
import { useSession } from "next-auth/react";

/* eslint-disable no-unused-vars */
interface AuthorsTableProps {
  authors: Author[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  sortField: keyof Author;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  isDeleting: boolean;
  isLoading: boolean;
  onSort({ field }: { field: keyof Author }): void;
  onPageChange({ page }: { page: number }): void;
  onEdit({ item }: { item: Author }): void;
  onDelete({ item }: { item: Author }): void;
  onItemsPerPageChange({ limit }: { limit: number }): void;
}
/* eslint-enable no-unused-vars */

type TableAuthor = Author & { sequence: number };

export default function AuthorsTable({
  authors,
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
}: AuthorsTableProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const enrichedAuthors: TableAuthor[] = authors.map((author, index) => ({
    ...author,
    sequence: (currentPage - 1) * itemsPerPage + (index + 1),
  }));

  const baseColumns: Column<TableAuthor>[] = [
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
        <span className="text-sm text-gray-500">
          {typeof value === "string" ? value : String(value ?? "")}
        </span>
      ),
    },
    {
      field: "description",
      label: "Description",
      sortable: true,
      render: ({ value }) => {
        const text =
          typeof value === "string" ? value : String(value ?? "No description");

        return (
          <div className="w-fit max-w-[300px]">
            <ExpandableContent
              content={text || "No description"}
              maxWords={10}
              className="text-sm text-gray-500"
            />
          </div>
        );
      },
    },
    {
      field: "articles_count",
      label: "Articles",
      sortable: true,
      render: ({ value }) => {
        const total =
          typeof value === "number" ? value : Number.parseInt(String(value ?? 0), 10);

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
      field: "bio",
      label: "Bio",
      sortable: true,
      render: ({ value }) => {
        const text =
          typeof value === "string" ? value : String(value ?? "No bio");

        return (
          <div className="w-fit max-w-[300px]">
            <ExpandableContent
              content={text || "No bio"}
              maxWords={10}
              className="text-sm text-gray-500"
            />
          </div>
        );
      },
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

  // Only add the actions column if the user is an admin
  const actionColumn: Column<TableAuthor> = {
    field: "id",
    label: "Actions",
    sortable: false,
    render: ({ row: author }) => (
      <div className="flex justify-start items-start space-x-2">
        <button
          onClick={() => onEdit({ item: author })}
          className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors	duration-200"
        >
          <PencilIcon className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete({ item: author })}
          disabled={isDeleting}
          className="inline-flex items-center gap-1 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors	duration-200 disabled:opacity-50"
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </button>
      </div>
    ),
  };

  const columns: Column<TableAuthor>[] = isAdmin
    ? [...baseColumns, actionColumn]
    : baseColumns;

  // Description: Render authors table with pagination, sorting, and admin actions.
  // Data created: 2024-11-13
  // Author: thangtruong
  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <Table<TableAuthor>
            data={enrichedAuthors}
            columns={columns}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            sortField={sortField as keyof TableAuthor}
            sortDirection={sortDirection}
            onSort={({ field }) => {
              if (field === "sequence") return;
              onSort({ field: field as keyof Author });
            }}
            onPageChange={({ page }) => onPageChange({ page })}
            onEdit={({ item }) => onEdit({ item })}
            onDelete={({ item }) => onDelete({ item })}
            isDeleting={isDeleting}
            searchQuery={searchQuery}
            isLoading={isLoading}
            onItemsPerPageChange={({ limit }) =>
              onItemsPerPageChange({ limit })
            }
          />
        </div>
      </div>
    </div>
  );
}
