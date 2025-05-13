"use client";

import React, { useState, useEffect } from "react";
import { getUsers, searchUsers } from "../../lib/actions/users";
import { SearchWrapper } from "../../components/dashboard/shared/search";
import { User } from "../../lib/definition";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { deleteUser } from "../../lib/actions/users";
import { useSession } from "next-auth/react";
import UsersHeader from "../../components/dashboard/users/UsersHeader";
import UsersTable from "../../components/dashboard/users/UsersTable";

// Use static rendering by default, but revalidate every 60 seconds
export const revalidate = 60;

interface PageProps {
  searchParams?: {
    query?: string;
    page?: string;
    sortField?: string;
    sortDirection?: "asc" | "desc";
    limit?: string;
  };
}

export default function UsersPage({ searchParams }: PageProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const searchQuery = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = Number(searchParams?.limit) || 5; // Default to 5 if not specified
  const sortField = (searchParams?.sortField as keyof User) || "created_at";
  const sortDirection = searchParams?.sortDirection || "desc";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSearching) {
          setIsLoading(true);
        }
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

        if (result.error) {
          setError(result.error);
          return;
        }

        setUsers(result.data || []);
        setTotalItems(result.totalItems || 0);
        setTotalPages(result.totalPages || 1);
      } catch (error) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    };

    fetchData();
  }, [searchQuery, currentPage, sortField, sortDirection, itemsPerPage]);

  const handleSort = (field: keyof User) => {
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/users?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/dashboard/users?${params.toString()}`);
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    params.set("page", "1"); // Reset to first page when changing items per page
    router.push(`/dashboard/users?${params.toString()}`);
  };

  const handleEdit = (user: User) => {
    router.push(`/dashboard/users/${user.id}/edit?edit=true`, {
      scroll: false,
    });
  };

  const handleDelete = async (user: User) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setIsDeleting(true);
        const success = await deleteUser(user.id);
        if (success) {
          await updateSession();
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
    }
  };

  const handleSearch = (term: string) => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.push(`/dashboard/users?${params.toString()}`);
  };

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading users
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasUsers = users.length > 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <UsersHeader />

      <div className="mt-4">
        <SearchWrapper
          placeholder="Search users by name, email, or role..."
          onSearch={handleSearch}
        />
      </div>

      {isLoading && !isSearching ? (
        <div className="mt-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : hasUsers ? (
        <UsersTable
          users={users}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          sortField={sortField}
          sortDirection={sortDirection}
          searchQuery={searchQuery}
          isDeleting={isDeleting}
          isLoading={isSearching}
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
