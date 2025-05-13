"use client";

import React, { useState } from "react";
import { User } from "../../../../lib/definition";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { deleteUser } from "../../../../lib/actions/users";
import Pagination from "../pagination/Pagination";
import MobileView from "./views/MobileView";
import TabletView from "./views/TabletView";
import DesktopView from "./views/DesktopView";
import { TableProps } from "../types/index";
import { format } from "date-fns";

// Bind the server action
const deleteUserAction = deleteUser;

/**
 * Main table component for displaying and managing users
 * Handles sorting, pagination, and user actions (edit/delete)
 */
export default function UsersTableClient({
  users,
  searchQuery = "",
}: TableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof User>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  /**
   * Handles sorting of table data
   * Toggles sort direction if same field is clicked
   */
  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  /**
   * Handles navigation to edit user page
   */
  const handleEdit = (userId: number) => {
    router.push(`/dashboard/users/${userId}/edit?edit=true`, { scroll: false });
  };

  /**
   * Handles user deletion with confirmation
   */
  const handleDelete = async (userId: number) => {
    try {
      setIsDeleting(true);
      const success = await deleteUser(userId);
      if (success) {
        toast.success("User deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    Object.values(user).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    if (aValue === bValue) return 0;
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    return sortDirection === "asc" ? 1 : -1;
  });

  // Paginate users
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "dd/MM/yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50">
            {/* Mobile view for small screens */}
            <MobileView
              users={paginatedUsers}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />

            {/* Tablet view for medium screens */}
            <TabletView
              users={paginatedUsers}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />

            {/* Desktop view for large screens */}
            <DesktopView
              users={paginatedUsers}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>
        </div>
      </div>

      {/* Pagination controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredUsers.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
