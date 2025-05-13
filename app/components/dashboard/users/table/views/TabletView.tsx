"use client";

import { User } from "../../../../../lib/definition";
import { TableViewProps } from "../../types";
import TableActions from "../TableActions";

/**
 * Tablet view component for displaying users in a side-by-side card format
 * Optimized for medium screens (768px - 1024px)
 */
export default function TabletView({
  users,
  currentPage,
  itemsPerPage,
  onEdit,
  onDelete,
  isDeleting,
}: TableViewProps) {
  return (
    <div className="hidden md:block lg:hidden">
      <div className="space-y-4">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow p-6 space-y-4 border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            {/* Header with Sequence and Status */}
            <div className="flex justify-between items-center">
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

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* First Name */}
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-900 w-24">
                    First Name
                  </div>
                  <h3 className="text-sm font-normal text-zinc-500 flex-1">
                    {user.firstname}
                  </h3>
                </div>

                {/* Last Name */}
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-900 w-24">
                    Last Name
                  </div>
                  <h3 className="text-sm font-normal text-zinc-500 flex-1">
                    {user.lastname}
                  </h3>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-900 w-24">
                    Email
                  </div>
                  <span className="text-sm font-normal text-zinc-500 flex-1">
                    {user.email}
                  </span>
                </div>

                {/* Role */}
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-900 w-24">
                    Role
                  </div>
                  <span className="text-sm font-normal text-zinc-500 flex-1">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Description */}
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-900 w-24">
                    Description
                  </div>
                  <span className="text-sm font-normal text-zinc-500 flex-1">
                    {user.description || "-"}
                  </span>
                </div>

                {/* Created At */}
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-900 w-24">
                    Created At
                  </div>
                  <span className="text-sm font-normal text-zinc-500 flex-1">
                    {new Date(user.created_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>

                {/* Updated At */}
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-900 w-24">
                    Updated At
                  </div>
                  <span className="text-sm font-normal text-zinc-500 flex-1">
                    {new Date(user.updated_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-900 w-24">
                  Actions
                </div>
                <div className="flex-1">
                  <TableActions
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={isDeleting}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
