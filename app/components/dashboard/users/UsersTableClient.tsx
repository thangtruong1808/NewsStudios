"use client";

import { useState } from "react";
import { User } from "../../../lib/definition";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { deleteUser } from "../../../lib/actions/users";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";
import Pagination from "./Pagination";

interface UsersTableClientProps {
  users: User[];
  searchQuery?: string;
}

export default function UsersTableClient({
  users,
  searchQuery = "",
}: UsersTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] =
    useState<keyof User>("firstname");
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc"
  >("asc");

  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(
        sortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (userId: number) => {
    router.push(
      `/dashboard/users/${userId}/edit?edit=true`,
      { scroll: false }
    );
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (
      typeof aValue === "string" &&
      typeof bValue === "string"
    ) {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (
    id: number,
    userName: string
  ) => {
    const confirmPromise = new Promise<boolean>(
      (resolve) => {
        toast(
          (t) => (
            <div className="flex flex-col items-center">
              <p className="mb-2">
                Are you sure you want to delete user "
                {userName}"?
              </p>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(true);
                  }}
                >
                  Delete
                </button>
                <button
                  className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          { duration: 5000 }
        );
      }
    );

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const { error } = await deleteUser(id);
      if (error) {
        toast.error(
          <div>
            <p className="font-bold">
              Failed to delete user
            </p>
            <p className="text-sm">{error}</p>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.success("User deleted successfully");
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        <div>
          <p className="font-bold">
            An error occurred while deleting the user
          </p>
          <p className="text-sm">
            {error instanceof Error
              ? error.message
              : "Unknown error"}
          </p>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50">
            <div className="md:hidden">
              {paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p className="font-medium text-gray-900">
                          ID: {user.id} - {user.firstname}{" "}
                          {user.lastname}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(
                            user.id,
                            `${user.firstname} ${user.lastname}`
                          )
                        }
                        disabled={isDeleting}
                        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table ">
              <TableHeader
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <tbody className="bg-white">
                {paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    user={user}
                    index={
                      (currentPage - 1) * itemsPerPage +
                      index
                    }
                    onEdit={(user) => handleEdit(user.id)}
                    onDelete={(user) =>
                      handleDelete(
                        user.id,
                        `${user.firstname} ${user.lastname}`
                      )
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={users.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
