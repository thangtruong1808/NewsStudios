"use client";

declare global {
  interface Window {
    confirm: (message?: string) => boolean;
  }
}

import { useState, useEffect } from "react";
import { Category } from "@/app/lib/definition";
import { getTableColumns } from "./TableColumns";
import { TableHeader } from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import { toast } from "react-hot-toast";
import { deleteCategory } from "@/app/lib/actions/categories";
import { useRouter } from "next/navigation";
import MobileCategoryCard from "./MobileCategoryCard";

interface CategoriesTableClientProps {
  categories: Category[];
}

export default function CategoriesTableClient({
  categories,
}: CategoriesTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [mounted, setMounted] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (category: Category) => {
    router.push(`/dashboard/categories/${category.id}/edit`);
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-2">
              Are you sure you want to delete category "{name}"?
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
      const { error } = await deleteCategory(id);
      if (error) {
        toast.error(`Failed to delete category: ${error}`);
      } else {
        toast.success("Category deleted successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred while deleting the category");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = getTableColumns(
    currentPage,
    itemsPerPage,
    handleDelete,
    isDeleting
  );

  const sortData = (data: Category[]) => {
    return [...data].sort((a, b) => {
      const aValue = a[sortField as keyof Category];
      const bValue = b[sortField as keyof Category];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      return 0;
    });
  };

  // Sort categories
  const sortedCategories = sortData(categories);

  // Paginate categories
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = sortedCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50">
            {/* Mobile view */}
            <div className="md:hidden">
              {paginatedCategories.map((category) => (
                <div
                  key={category.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p className="font-medium text-gray-900">
                          ID: {category.id} - {category.name}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {category.description || "No description"}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
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
            {/* Desktop view */}
            <table className="hidden min-w-full text-gray-900 md:table">
              <TableHeader
                columns={columns}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <TableBody
                categories={paginatedCategories}
                columns={columns}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={categories.length}
      />
    </div>
  );
}
