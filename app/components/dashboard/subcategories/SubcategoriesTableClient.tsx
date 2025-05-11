"use client";

import { useState } from "react";
import { SubCategory as Subcategory } from "../../../lib/definition";
import { getTableColumns } from "./TableColumns";
import { toast } from "react-hot-toast";
import { deleteSubcategory } from "../../../lib/actions/subcategories";
import { useRouter } from "next/navigation";
import Pagination from "../categories/Pagination";
import { TableHeader } from "./TableHeader";
import TableBody from "./TableBody";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface SubcategoriesTableClientProps {
  subcategories: Subcategory[];
}

export default function SubcategoriesTableClient({
  subcategories,
}: SubcategoriesTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 10;

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete subcategory "${name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteSubcategory(id);
      if (!result.success) {
        toast.error(
          <div>
            <p className="font-bold">Failed to delete subcategory</p>
            <p className="text-sm">{result.error}</p>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.success("Subcategory deleted successfully");
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error(
        <div>
          <p className="font-bold">
            An error occurred while deleting the subcategory
          </p>
          <p className="text-sm">Please try again later</p>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const columns = getTableColumns(
    currentPage,
    itemsPerPage,
    handleDelete,
    isDeleting
  );

  const sortData = (data: Subcategory[]) => {
    return [...data].sort((a, b) => {
      const aValue = a[sortField as keyof Subcategory];
      const bValue = b[sortField as keyof Subcategory];

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

  // Sort subcategories
  const sortedSubcategories = sortData(subcategories);

  // Paginate subcategories
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubcategories = sortedSubcategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(subcategories.length / itemsPerPage);

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50">
            {/* Mobile View */}
            <div className="md:hidden">
              {paginatedSubcategories.map((subcategory, index) => (
                <div
                  key={subcategory.id}
                  className="mb-4 w-full rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-zinc-200/50"
                >
                  {/* Header with ID and Name */}
                  <div className="border-b border-gray-100 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-gray-500">
                        #{(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {subcategory.name}
                      </h3>
                    </div>
                  </div>

                  {/* Subcategory Details */}
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base font-medium text-gray-500">
                          Description
                        </span>
                        <p className="mt-1 text-base text-gray-900">
                          {subcategory.description || "-"}
                        </p>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base font-medium text-gray-500">
                          Category
                        </span>
                        <p className="mt-1 text-base text-gray-900">
                          {subcategory.category_name || "-"}
                        </p>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base font-medium text-gray-500">
                          Created
                        </span>
                        <p className="mt-1 text-base text-gray-900">
                          {new Date(subcategory.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base font-medium text-gray-500">
                          Updated
                        </span>
                        <p className="mt-1 text-base text-gray-900">
                          {new Date(subcategory.updated_at).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex justify-around border-t border-gray-100 pt-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/subcategories/${subcategory.id}/edit`
                          )
                        }
                        className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(subcategory.id, subcategory.name)
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
              {paginatedSubcategories.map((subcategory, index) => (
                <div
                  key={subcategory.id}
                  className="mb-4 w-full rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-zinc-200/50"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-medium text-gray-500">
                          #{(currentPage - 1) * itemsPerPage + index + 1}
                        </span>
                        <h3 className="text-base font-medium text-gray-900">
                          {subcategory.name}
                        </h3>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/subcategories/${subcategory.id}/edit`
                            )
                          }
                          className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(subcategory.id, subcategory.name)
                          }
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base text-gray-500">
                          Description:
                        </span>
                        <span className="ml-2 text-base text-gray-900">
                          {subcategory.description || "-"}
                        </span>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base text-gray-500">
                          Category:
                        </span>
                        <span className="ml-2 text-base text-gray-900">
                          {subcategory.category_name || "-"}
                        </span>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base text-gray-500">
                          Created:
                        </span>
                        <span className="ml-2 text-base text-gray-900">
                          {new Date(subcategory.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base text-gray-500">
                          Updated:
                        </span>
                        <span className="ml-2 text-base text-gray-900">
                          {new Date(subcategory.updated_at).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
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
              <TableBody
                subcategories={paginatedSubcategories}
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
        totalItems={subcategories.length}
      />
    </div>
  );
}
