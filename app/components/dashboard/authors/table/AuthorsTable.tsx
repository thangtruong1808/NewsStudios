"use client";

import Table from "@/app/components/dashboard/shared/table/Table";
import type { Column } from "@/app/components/dashboard/shared/table/TableTypes";
import { Author } from "@/app/lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";
import { formatDateWithMonth } from "@/app/lib/utils/dateFormatter";
import { useSession } from "next-auth/react";

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
  onSort: (field: keyof Author) => void;
  onPageChange: (page: number) => void;
  onEdit: (author: Author) => void;
  onDelete: (author: Author) => void;
  onItemsPerPageChange: (limit: number) => void;
}

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

  const columns: Column<Author & { sequence?: number; actions?: never }>[] = [
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
        <div className="w-fit max-w-[300px]">
          <ExpandableContent
            content={value || "No description"}
            maxWords={10}
            className="text-sm text-gray-500"
          />
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
      field: "bio",
      label: "Bio",
      sortable: true,
      render: (value: string) => (
        <div className="w-fit max-w-[300px]">
          <ExpandableContent
            content={value || "No bio"}
            maxWords={10}
            className="text-sm text-gray-500"
          />
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
      render: (_: unknown, author: Author) => (
        <div className="flex justify-start items-start space-x-2">
          <button
            onClick={() => onEdit(author)}
            className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(author)}
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
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <Table
            data={authors}
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
            searchQuery={searchQuery}
            isLoading={isLoading}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
}
