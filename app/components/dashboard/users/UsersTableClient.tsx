"use client";

import { useState } from "react";
import { User } from "../../../lib/definition";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { deleteUser } from "../../../lib/actions/users";
import TableHeader from "../shared/TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

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
  const [sortField, setSortField] = useState<keyof User>("firstname");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (userId: number) => {
    router.push(`/dashboard/users/${userId}/edit?edit=true`, { scroll: false });
  };

  const handleDelete = async (userData: {
    id: number;
    firstname: string;
    lastname: string;
  }) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-2">
              Are you sure you want to delete user "{userData.firstname}{" "}
              {userData.lastname}"?
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
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const result = await deleteUser(userData.id);
      if (!result.success) {
        toast.error(
          <div>
            <p className="font-bold">Failed to delete user</p>
            <p className="text-sm">{result.error}</p>
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
          <p className="font-bold">An error occurred while deleting the user</p>
          <p className="text-sm">Please try again later</p>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
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

  const columns = [
    {
      key: "sequence",
      label: "#",
      sortable: false,
    },
    {
      key: "firstname",
      label: "First Name",
      sortable: true,
    },
    {
      key: "lastname",
      label: "Last Name",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "created_at",
      label: "Created At",
      sortable: true,
    },
    {
      key: "updated_at",
      label: "Updated At",
      sortable: true,
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
    },
  ];

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50">
            {/* Mobile View */}
            <div className="md:hidden">
              {paginatedUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="mb-4 w-full rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-zinc-200/50"
                >
                  {/* Header with ID and Name */}
                  <div className="border-b border-gray-100 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        #{(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                      <h3 className="text-base font-medium text-gray-900">
                        {user.firstname} {user.lastname}
                      </h3>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-xs font-medium text-gray-500">
                          Email
                        </span>
                        <p className="mt-1 text-sm text-gray-900">
                          {user.email}
                        </p>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-xs font-medium text-gray-500">
                          Role
                        </span>
                        <p className="mt-1 text-sm text-gray-900">
                          {user.role}
                        </p>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-xs font-medium text-gray-500">
                          Status
                        </span>
                        <div className="mt-1">
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
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-xs font-medium text-gray-500">
                          Description
                        </span>
                        <p className="mt-1 text-sm text-gray-900">
                          {user.description || "-"}
                        </p>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-xs font-medium text-gray-500">
                          Created
                        </span>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-xs font-medium text-gray-500">
                          Updated
                        </span>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(user.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex justify-around border-t border-gray-100 pt-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete({
                            id: user.id,
                            firstname: user.firstname,
                            lastname: user.lastname,
                          })
                        }
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet/Medium Desktop View (1024px - 1440px) */}
            <div className="hidden md:block 2xl:hidden">
              {paginatedUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="mb-4 w-full rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-zinc-200/50"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">
                          #{(currentPage - 1) * itemsPerPage + index + 1}
                        </span>
                        <h3 className="text-sm font-medium text-gray-900">
                          {user.firstname} {user.lastname}
                        </h3>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete({
                              id: user.id,
                              firstname: user.firstname,
                              lastname: user.lastname,
                            })
                          }
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-2 text-gray-900">{user.email}</span>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-gray-500">Role:</span>
                        <span className="ml-2 text-gray-900">{user.role}</span>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-gray-500">Status:</span>
                        <span
                          className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Large Desktop View (1440px and above) */}
            <table className="hidden 2xl:table min-w-full text-gray-900">
              <TableHeader
                columns={columns}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <tbody className="bg-white">
                {paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    user={user}
                    index={(currentPage - 1) * itemsPerPage + index}
                    onEdit={(user) => handleEdit(user.id)}
                    onDelete={(user) =>
                      handleDelete({
                        id: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                      })
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
