"use client";

declare global {
  interface Window {
    confirm: (message: string) => boolean;
  }
}

import { useState } from "react";
import { Category } from "../../../type/definitions";
import { getTableColumns } from "./TableColumns";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import { toast } from "react-hot-toast";
import { deleteCategory } from "../../../lib/actions/categories";
import { useRouter } from "next/navigation";

interface CategoriesTableClientProps {
  categories: Category[];
}

export default function CategoriesTableClient({
  categories = [],
}: CategoriesTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Category>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handleSort = (field: keyof Category) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: number, categoryName: string) => {
    // Use toast for confirmation instead of window.confirm
    const confirmPromise = new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-2">
              Are you sure you want to delete the category "{categoryName}"?
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
        // Use router.refresh() instead of window.location.reload()
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

  // Sort categories
  const sortedCategories = [...categories].sort((a, b) => {
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
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  // Paginate categories
  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
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
        itemsPerPage={itemsPerPage}
        totalItems={categories.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
