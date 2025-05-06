"use client";

import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { User } from "../../../login/login-definitions";
import { Column } from "./types";
import DeleteUserButton from "./DeleteUserButton";

export function getTableColumns(
  currentPage: number,
  itemsPerPage: number,
  handleDelete: (id: number, userName: string) => void,
  isDeleting: boolean
): Column[] {
  return [
    {
      key: "id",
      label: "ID",
      sortable: false,
      accessor: "id",
      cell: (value: string | number, index: number, user: User) => (
        <div className="whitespace-nowrap text-xs font-medium text-gray-900 sm:text-sm">
          {value}
        </div>
      ),
    },
    {
      key: "firstname",
      label: "Name",
      sortable: true,
      accessor: "firstname",
      cell: (value: string | number, index: number, user: User) => (
        <div className="whitespace-nowrap text-xs font-medium text-gray-900 sm:text-sm">
          {user.firstname} {user.lastname}
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: false,
      accessor: "email",
      cell: (value: string | number, index: number, user: User) => (
        <div className="whitespace-nowrap text-xs text-gray-500 hidden md:table-cell sm:text-sm">
          {value}
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: false,
      accessor: "role",
      cell: (value: string | number, index: number, user: User) => (
        <div className="whitespace-nowrap text-xs text-gray-500 hidden md:table-cell sm:text-sm">
          {value}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      accessor: "status",
      cell: (value: string | number, index: number, user: User) => (
        <div className="whitespace-nowrap text-xs sm:text-sm">
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
              value === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      accessor: "id",
      cell: (value: string | number, index: number, user: User) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          <div className="flex justify-center gap-2 p-3">
            <Link
              href={`/dashboard/users/${user.id}/edit`}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <button
              disabled={true}
              className="text-gray-400 cursor-not-allowed"
              title="Delete functionality is currently disabled"
            >
              <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      ),
    },
  ];
}
