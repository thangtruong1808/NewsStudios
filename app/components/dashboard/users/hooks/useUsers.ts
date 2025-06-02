"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchQuery = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 10;
  const sortField =
    (searchParams.get("sortField") as keyof User) || "created_at";
  const sortDirection =
    (searchParams.get("sortDirection") as "asc" | "desc") || "desc";

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
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
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete User",
        message:
          "Are you sure you want to delete this user? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const { success, error } = await deleteUser(user.id);
      if (success) {
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
        showSuccessToast({ message: "User deleted successfully" });
      } else {
        showErrorToast({ message: error || "Failed to delete user" });
      }
    } catch (error) {
      showErrorToast({ message: "Failed to delete user" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasUsers = users.length > 0;

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
