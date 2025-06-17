"use client";

import { Table, Column } from "../../dashboard/shared/table";
import { User } from "../../../lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";
import { formatDateWithMonth } from "@/app/lib/utils/dateFormatter";
import { useSession } from "next-auth/react";

/**
 * Props interface for UsersTable component
 * Defines the required data and callbacks for the table functionality
 */
interface UsersTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  sortField: keyof (User & { sequence?: number });
  sortDirection: "asc" | "desc";
  searchQuery: string;
  isDeleting: boolean;
  isLoading: boolean;
  onSort: (field: keyof (User & { sequence?: number })) => void;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onItemsPerPageChange: (limit: number) => void;
}

/**
 * UsersTable Component
 * Renders a data table for user management with features:
 * - Row numbering and user image display
 * - Sortable columns for user data
 * - Expandable description content
 * - Status badges with color coding
 * - Formatted date displays
 * - Action buttons for edit and delete operations (admin only)
 */
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
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  // Define table columns with their properties and custom render functions
  const columns: Column<User & { sequence?: number; actions?: never }>[] = [
    // Sequence number column for row numbering
    {
      field: "sequence",
      label: "#",
      sortable: false,
      render: (value) => <span className="text-sm text-gray-500">{value}</span>,
    },
    // User image column with fallback to initials if no image
    {
      field: "user_image",
      label: "Image",
      sortable: false,
      render: (value: string, user: User) => (
        <div className="w-10 h-10 relative rounded-full overflow-hidden">
          {value ? (
            <Image
              src={value}
              alt={`${user.firstname} ${user.lastname}`}
              width={40}
              height={40}
              className="object-cover rounded-full"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-300 flex items-center justify-center">
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
      render: (value) => <span className="text-sm text-gray-500">{value}</span>,
    },
    {
      field: "lastname",
      label: "Last Name",
      sortable: true,
      render: (value) => <span className="text-sm text-gray-500">{value}</span>,
    },
    {
      field: "email",
      label: "Email",
      sortable: true,
      render: (value) => <span className="text-sm text-gray-500">{value}</span>,
    },
    // Description column with expandable content for long text
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
      field: "role",
      label: "Role",
      sortable: true,
      render: (value) => <span className="text-sm text-gray-500">{value}</span>,
    },
    // Status column with color-coded badges for active/inactive states
    {
      field: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm ${value === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}
        >
          {value}
        </span>
      ),
    },
    // Created At column with formatted date display
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
      render: (value: string) => (
        <div className="w-24">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {formatDateWithMonth(value)}
          </span>
        </div>
      ),
    },
    // Updated At column with formatted date display
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
      render: (value: string) => (
        <div className="w-24">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {formatDateWithMonth(value)}
          </span>
        </div>
      ),
    },
    // Actions column with Edit and Delete buttons (only for admin)
    ...(isAdmin
      ? [
        {
          field: "actions" as keyof (User & {
            sequence?: number;
            actions?: never;
          }),
          label: "Actions",
          sortable: false,
          render: (_: unknown, user: User) => (
            <div className="flex justify-start items-start space-x-2">
              <button
                onClick={() => onEdit(user)}
                className="inline-flex items-center gap-1 rounded border border-blue-500 px-2 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
              >
                <PencilIcon className="h-5 w-5" />
                Edit
              </button>
              <button
                onClick={() => onDelete(user)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
              >
                <TrashIcon className="h-5 w-5" />
                Delete
              </button>
            </div>
          ),
        },
      ]
      : []),
  ];

  // Render the table component with all configured columns and data
  return (
    <div className="mt-5">
      <Table
        data={users.map((user, index) => ({
          ...user,
          sequence: (currentPage - 1) * itemsPerPage + index + 1,
        }))}
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
