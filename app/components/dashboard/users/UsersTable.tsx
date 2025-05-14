"use client";

import { Table, Column } from "../../dashboard/shared/table";
import { User } from "../../../lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface UsersTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  sortField: keyof User;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  isDeleting: boolean;
  isLoading: boolean;
  onSort: (field: keyof User) => void;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onItemsPerPageChange: (limit: number) => void;
}

export default function UsersTable({
  users,
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
}: UsersTableProps) {
  const columns: Column<User & { sequence?: number; actions?: never }>[] = [
    {
      field: "sequence",
      label: "#",
      sortable: false,
    },
    {
      field: "user_image",
      label: "Image",
      sortable: false,
      render: (value: string, user: User) => (
        <div className="w-10 h-10 relative rounded-full overflow-hidden">
          {value ? (
            <Image
              src={value}
              alt="User"
              fill
              className="object-cover"
              sizes="(max-width: 40px) 100vw, 40px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.firstname?.[0]?.toUpperCase()}
                {user.lastname?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      field: "firstname",
      label: "First Name",
      sortable: true,
    },
    {
      field: "lastname",
      label: "Last Name",
      sortable: true,
    },
    {
      field: "email",
      label: "Email",
      sortable: true,
    },
    {
      field: "role",
      label: "Role",
      sortable: true,
    },
    {
      field: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
      render: (value: string) => (
        <div className="w-32">
          <span className="text-sm text-zinc-500 whitespace-nowrap text-left">
            {new Date(value).toLocaleDateString()}
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
          <span className="text-sm text-zinc-500 whitespace-nowrap text-left">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      field: "actions",
      label: "Actions",
      sortable: false,
      render: (_: unknown, user: User) => (
        <div className="flex justify-start items-start space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(user)}
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
    <div className="mt-8">
      <Table
        data={users}
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
  );
}
