"use client";

import { User } from "../../../../../lib/definition";
import { TableViewProps } from "../../types";
import TableActions from "../TableActions";

/**
 * Desktop view component for displaying users in a table format
 * Optimized for large screens (≥ 1024px)
 */
export default function DesktopView({
  users,
  currentPage,
  itemsPerPage,
  onEdit,
  onDelete,
  isDeleting,
}: TableViewProps) {
  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-900"
              >
                #
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-900"
              >
                First Name
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-900"
              >
                Last Name
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-900"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-900"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-900"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-900"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-900"
              >
                Created At
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-900"
              >
                Updated At
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-900"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-3 py-3 whitespace-nowrap text-sm font-normal text-zinc-500">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-normal text-zinc-500">
                  {user.firstname}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-normal text-zinc-500">
                  {user.lastname}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-normal text-zinc-500">
                  {user.email}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-normal text-zinc-500">
                  {user.role}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-normal text-zinc-500">
                  {user.description || "-"}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-normal text-zinc-500">
                  {new Date(user.created_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-normal text-zinc-500">
                  {new Date(user.updated_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-normal text-zinc-500">
                  <TableActions
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={isDeleting}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
