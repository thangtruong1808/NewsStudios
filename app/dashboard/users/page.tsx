"use client";

import React from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getUsers, searchUsers } from "../../lib/actions/users";
import UsersTable from "../../components/dashboard/users/UsersTable";
import { SearchWrapper } from "../../components/dashboard/shared/search";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/app/lib/definition";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";

// Use static rendering by default, but revalidate every 60 seconds
export const revalidate = 60;

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 10;
  const sortField =
    (searchParams.get("sortField") as keyof User) || "created_at";
  const sortDirection =
    (searchParams.get("sortDirection") as "asc" | "desc") || "desc";
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [totalItems, setTotalItems] = React.useState(0);

  // Table column configuration for user data display
  const columns = [
    {
      field: "firstname",
      label: "First Name",
      sortable: true,
    },
    {
      field: "lastname",
      label: "Last Name",
      sortable: true,
    },
    {
      field: "email",
      label: "Email",
      sortable: true,
    },
    {
      field: "role",
      label: "Role",
      sortable: true,
    },
    {
      field: "status",
      label: "Status",
      sortable: true,
    },
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
    },
  ];

  // Fetch users data based on search query and pagination parameters
  React.useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const result = searchQuery
        ? await searchUsers(searchQuery, {
            page: currentPage,
            limit: itemsPerPage,
            sortField,
            sortDirection,
          })
        : await getUsers({
            page: currentPage,
            limit: itemsPerPage,
            sortField,
            sortDirection,
          });

      if (!result.error) {
        setUsers(result.data || []);
        if ("totalItems" in result) {
          setTotalItems(result.totalItems);
        }
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, [searchQuery, currentPage, itemsPerPage, sortField, sortDirection]);

  // Handle sorting functionality for table columns
  const handleSort = (field: keyof User) => {
    const params = new URLSearchParams(searchParams);
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`?${params.toString()}`);
  };

  // Handle pagination - navigate to selected page
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  // Navigate to user edit page
  const handleEdit = (user: User) => {
    router.push(`/dashboard/users/${user.id}/edit`);
  };

  // Handle user deletion with confirmation
  const handleDelete = async (user: User) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setIsDeleting(true);
      try {
        // Add delete logic here
        router.refresh();
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Update items per page and reset to first page
  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // Calculate total number of pages for pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Check if there are any users to display
  const hasUsers = users.length > 0;

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-blue-600">Users List</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage, organize, and assign users to articles for better content
            attribution and collaboration.
          </p>
        </div>

        <Link
          href="/dashboard/users/create"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 justify-center items-center"
        >
          <PlusIcon className="h-5 mr-2" />
          <span>Create User</span>
        </Link>
      </div>

      <div className="my-6">
        <SearchWrapper
          placeholder="Search users by name, email, or role..."
          onSearch={(term) => {
            const params = new URLSearchParams(searchParams);
            if (term) {
              params.set("query", term);
            } else {
              params.delete("query");
            }
            params.set("page", "1");
            router.push(`?${params.toString()}`);
          }}
        />
      </div>

      {isLoading ? (
        <TableSkeleton columns={columns} itemsPerPage={itemsPerPage} />
      ) : hasUsers ? (
        <UsersTable
          users={users}
          searchQuery={searchQuery}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          sortField={sortField}
          sortDirection={sortDirection}
          isDeleting={isDeleting}
          isLoading={isLoading}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      ) : (
        <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">
            {searchQuery
              ? "No users found matching your search criteria."
              : "No users found. Create your first user to get started."}
          </p>
        </div>
      )}
    </div>
  );
}
