"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { getUsers, searchUsers, deleteUser } from "@/app/lib/actions/users";
import { User } from "@/app/lib/definition";
import {
  showConfirmationToast,
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";

export function useUsers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const searchQuery = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 5;
  const sortField =
    (searchParams.get("sortField") as keyof User) || "created_at";
  const sortDirection =
    (searchParams.get("sortDirection") as "asc" | "desc") || "desc";

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasUsers, setHasUsers] = useState(false);

  const fetchUsers = async () => {
    try {
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

      if (result.error) {
        showErrorToast({ message: result.error });
        return;
      }

      setUsers(result.data || []);
      if ("totalItems" in result) {
        setTotalItems(result.totalItems);
      }
      if ("totalPages" in result) {
        setTotalPages(result.totalPages);
      }
      setHasUsers(result.data.length > 0);
    } catch (error) {
      showErrorToast({
        message:
          error instanceof Error ? error.message : "Failed to fetch users",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, currentPage, itemsPerPage, sortField, sortDirection]);

  const handleSort = (field: keyof (User & { sequence?: number })) => {
    const params = new URLSearchParams(searchParams);
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleEdit = (user: User) => {
    router.push(`/dashboard/users/${user.id}/edit`);
  };

  const handleDelete = async (user: User) => {
    // Check if the user is trying to delete themselves
    const isSelfDeletion = session?.user?.id === user.id.toString();

    const confirmMessage = isSelfDeletion
      ? "You are about to delete your own account. This action cannot be undone. Are you sure you want to proceed?"
      : "Are you sure you want to delete this user? This action cannot be undone.";

    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete User",
        message: confirmMessage,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const result = await deleteUser(user.id);
      if (result.success) {
        showSuccessToast({ message: "User deleted successfully" });

        if (isSelfDeletion) {
          // If self-deletion, sign out and redirect to login
          await signOut({
            redirect: true,
            callbackUrl: "/login",
          });
        } else {
          // For other deletions, fetch updated data
          await fetchUsers();

          // If current page is empty after deletion, go to previous page
          if (users.length === 1 && currentPage > 1) {
            handlePageChange(currentPage - 1);
          }
        }
      } else {
        showErrorToast({ message: result.error || "Failed to delete user" });
      }
    } catch (error) {
      showErrorToast({
        message:
          error instanceof Error ? error.message : "Failed to delete user",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    params.set("page", "1"); // Reset to first page when changing items per page
    router.push(`?${params.toString()}`);
  };

  return {
    users,
    isLoading,
    isDeleting,
    totalItems,
    totalPages,
    hasUsers,
    searchQuery,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    handleSort,
    handlePageChange,
    handleEdit,
    handleDelete,
    handleItemsPerPageChange,
  };
}
