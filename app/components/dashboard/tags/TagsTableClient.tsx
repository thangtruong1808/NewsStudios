"use client";

import { useState } from "react";
import { Tag } from "../../../lib/definition";
import { getTableColumns } from "./TableColumns";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import { toast } from "react-hot-toast";
import { deleteTag } from "../../../lib/actions/tags";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface TagsTableClientProps {
  tags: Tag[];
}

export default function TagsTableClient({ tags = [] }: TagsTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Tag>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;
  const tagsArray = Array.isArray(tags) ? tags : [];
  const totalPages = Math.ceil(tagsArray.length / itemsPerPage);

  const handleSort = (field: keyof Tag) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: number, tagName: string) => {
    // Use toast for confirmation instead of window.confirm
    const confirmPromise = new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-2">
              Are you sure you want to delete the tag "{tagName}"?
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
      const { error } = await deleteTag(id);
      if (error) {
        toast.error(`Failed to delete tag: ${error}`);
      } else {
        toast.success("Tag deleted successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred while deleting the tag");
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

  // Sort tags
  const sortedTags = [...tagsArray].sort((a, b) => {
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

  // Paginate tags
  const paginatedTags = sortedTags.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50">
            {/* Mobile View */}
            <div className="md:hidden">
              {paginatedTags.map((tag, index) => (
                <div
                  key={tag.id}
                  className="mb-4 w-full rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-zinc-200/50"
                >
                  {/* Header with Sequence and Name */}
                  <div className="border-b border-gray-100 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-gray-500">
                        #{(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {tag.name}
                      </h3>
                    </div>
                  </div>
                  {/* Tag Details */}
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base font-medium text-gray-500">
                          Description
                        </span>
                        <p className="mt-1 text-base text-gray-900">
                          {tag.description || "-"}
                        </p>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1 flex items-center">
                        <span className="text-base font-medium text-gray-500">
                          Color
                        </span>
                        <span className="ml-2 flex items-center">
                          <span
                            className="inline-block h-4 w-4 rounded-full mr-2"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="text-base text-gray-900">
                            {tag.color || "-"}
                          </span>
                        </span>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base font-medium text-gray-500">
                          Created
                        </span>
                        <p className="mt-1 text-base text-gray-900">
                          {new Date(tag.created_at).toLocaleDateString(
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
                          {new Date(tag.updated_at).toLocaleDateString(
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
                      <Link
                        href={`/dashboard/tags/${tag.id}/edit`}
                        className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(tag.id, tag.name)}
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
              {paginatedTags.map((tag, index) => (
                <div
                  key={tag.id}
                  className="mb-4 w-full rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-zinc-200/50"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-medium text-gray-500">
                          #{(currentPage - 1) * itemsPerPage + index + 1}
                        </span>
                        <h3 className="text-base font-medium text-gray-900">
                          {tag.name}
                        </h3>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/tags/${tag.id}/edit`}
                          className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(tag.id, tag.name)}
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
                          {tag.description || "-"}
                        </span>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1 flex items-center">
                        <span className="text-base text-gray-500">Color:</span>
                        <span className="ml-2 flex items-center">
                          <span
                            className="inline-block h-4 w-4 rounded-full mr-2"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="text-base text-gray-900">
                            {tag.color || "-"}
                          </span>
                        </span>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base text-gray-500">
                          Created:
                        </span>
                        <span className="ml-2 text-base text-gray-900">
                          {new Date(tag.created_at).toLocaleDateString(
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
                          {new Date(tag.updated_at).toLocaleDateString(
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
                tags={paginatedTags}
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
        totalItems={tagsArray.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
