"use client";

import { Table } from "../../dashboard/shared/table";
import type { Column } from "../../dashboard/shared/table";
import type { User } from "../../../lib/definition";
import Image from "next/image";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";
import { formatDateWithMonth } from "@/app/lib/utils/dateFormatter";
import { useSession } from "next-auth/react";

/* eslint-disable no-unused-vars */
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
  onSort: ({ field }: { field: keyof User | "sequence" }) => void;
  onPageChange: ({ page }: { page: number }) => void;
  onEdit: ({ item }: { item: User }) => void;
  onDelete: ({ item }: { item: User }) => void;
  onItemsPerPageChange: ({ limit }: { limit: number }) => void;
}
/* eslint-enable no-unused-vars */

// Component Info
// Description: Render dashboard users table with sortable columns, profile previews, and admin actions.
// Date created: 2025-11-18
// Author: thangtruong
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

  // Configure table columns and render helpers.
  const columns: Column<User & { sequence: number }>[] = [
    // Sequence number column for row numbering
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
    // User image column with fallback to initials if no image
    {
      field: "user_image",
      label: "Image",
      sortable: false,
      render: ({ value, row }) => (
        <div className="w-10 h-10 relative rounded-full overflow-hidden">
          {typeof value === "string" && value ? (
            <Image
              src={value}
              alt={`${row.firstname} ${row.lastname}`}
              width={40}
              height={40}
              className="object-cover rounded-full"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-300 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {row.firstname?.[0]?.toUpperCase()}
                {row.lastname?.[0]?.toUpperCase()}
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
      render: ({ value }) => (
        <span className="text-sm text-gray-500">{String(value ?? "")}</span>
      ),
    },
    {
      field: "lastname",
      label: "Last Name",
      sortable: true,
      render: ({ value }) => (
        <span className="text-sm text-gray-500">{String(value ?? "")}</span>
      ),
    },
    {
      field: "email",
      label: "Email",
      sortable: true,
      render: ({ value }) => (
        <span className="text-sm text-gray-500">{String(value ?? "")}</span>
      ),
    },
    // Description column with expandable content for long text
    {
      field: "description",
      label: "Description",
      sortable: true,
      render: ({ value }) => (
        <div className="w-64">
          <ExpandableContent
            content={
              typeof value === "string" && value ? value : "No description"
            }
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
      render: ({ value }) => (
        <span className="text-sm text-gray-500">{String(value ?? "")}</span>
      ),
    },
    // Status column with color-coded badges for active/inactive states
    {
      field: "status",
      label: "Status",
      sortable: true,
      render: ({ value }) => {
        const status = String(value ?? "");
        const isActive = status.toLowerCase() === "active";
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm ${isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {status}
          </span>
        );
      },
    },
    // Created At column with formatted date display
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
      render: ({ value }) => (
        <div className="w-24">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {formatDateWithMonth(String(value ?? ""))}
          </span>
        </div>
      ),
    },
    // Updated At column with formatted date display
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
      render: ({ value }) => (
        <div className="w-24">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {formatDateWithMonth(String(value ?? ""))}
          </span>
        </div>
      ),
    },
    // Actions column header (buttons are rendered automatically by TableRow)
    ...(isAdmin
      ? [
        {
          field: "actions" as keyof (User & { sequence: number }),
          label: "Actions",
          sortable: false,
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
        onSort={({ field }) => {
          if (field === "sequence") {
            onSort({ field });
            return;
          }
          onSort({ field: field as keyof User });
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
  );
}
