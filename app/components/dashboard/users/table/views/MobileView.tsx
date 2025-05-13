"use client";

import { User } from "../../../../../lib/definition";
import { TableViewProps } from "../../types";
import TableActions from "../TableActions";

/**
 * Mobile view component for displaying users in a card-like format
 * Optimized for small screens (< 768px)
 */
export default function MobileView({
  users,
  currentPage,
  itemsPerPage,
  onEdit,
  onDelete,
  isDeleting,
}: TableViewProps) {
  return (
    <div className="block md:hidden">
      <div className="space-y-4">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            {/* Header with Sequence and Status */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-zinc-500">
                #{(currentPage - 1) * itemsPerPage + index + 1}
              </span>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  user.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.status}
              </span>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  First Name
                </div>
                <h3 className="text-sm font-normal text-zinc-500">
                  {user.firstname}
                </h3>
              </div>

              {/* Last Name */}
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Last Name
                </div>
                <h3 className="text-sm font-normal text-zinc-500">
                  {user.lastname}
                </h3>
              </div>

              {/* Email */}
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Email
                </div>
                <span className="text-sm font-normal text-zinc-500">
                  {user.email}
                </span>
              </div>

              {/* Role */}
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Role
                </div>
                <span className="text-sm font-normal text-zinc-500">
                  {user.role}
                </span>
              </div>

              {/* Description */}
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Description
                </div>
                <span className="text-sm font-normal text-zinc-500">
                  {user.description || "-"}
                </span>
              </div>

              {/* Created At */}
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Created At
                </div>
                <span className="text-sm font-normal text-zinc-500">
                  {new Date(user.created_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              </div>

              {/* Updated At */}
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Updated At
                </div>
                <span className="text-sm font-normal text-zinc-500">
                  {new Date(user.updated_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Actions
              </div>
              <TableActions
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
