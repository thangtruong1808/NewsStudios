"use client";

declare global {
  interface Window {
    confirm: (message: string) => boolean;
  }
}

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { deleteUser } from "../../lib/actions/users";
import { User } from "../../lib/definitions";
import Pagination from "./users/Pagination";
import TableBody from "./users/TableBody";
import { getTableColumns } from "./users/TableColumns";
import TableHeader from "./users/TableHeader";

export default function UsersTableClient({ users }: { users: User[] }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<keyof User | null>("firstname");

  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;

    // Special handling for name sorting
    if (sortField === "firstname") {
      const aName = `${a.firstname} ${a.lastname}`;
      const bName = `${b.firstname} ${b.lastname}`;
      return sortDirection === "asc"
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: number, userName: string) => {
    // Custom confirmation dialog using toast
    const confirmPromise = new Promise<boolean>((resolve) => {
      let resolved = false;

      const toastId = toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-2">
              Are you sure you want to delete user "{userName}"?
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  resolved = true;
                  toast.dismiss(t.id);
                  resolve(true);
                }}
              >
                Delete
              </button>
              <button
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => {
                  resolved = true;
                  toast.dismiss(t.id);
                  resolve(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000, // Auto-dismiss after 5 seconds
        }
      );

      // Auto-resolve as false if the toast is dismissed by timeout
      setTimeout(() => {
        if (!resolved) {
          toast.dismiss(toastId);
          resolve(false);
        }
      }, 5000);
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        setIsDeleting(true);
        await deleteUser(id);
        resolve(true);
      } catch (error) {
        reject(error);
      } finally {
        setIsDeleting(false);
      }
    });

    toast
      .promise(deletePromise, {
        loading: "Deleting user...",
        success: "User deleted successfully",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to delete user",
      })
      .then(() => {
        router.refresh();
      });
  };

  const columns = getTableColumns(
    currentPage,
    itemsPerPage,
    handleDelete,
    isDeleting
  );

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <TableHeader
              columns={columns}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableBody
              users={paginatedUsers}
              columns={columns}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={users.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
