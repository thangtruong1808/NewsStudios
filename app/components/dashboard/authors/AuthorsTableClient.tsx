"use client";

declare global {
  interface Window {
    confirm: (message?: string) => boolean;
  }
}

import React, { useState, useEffect } from "react";
import { Author } from "../../../lib/definition";
import { getTableColumns } from "./TableColumns";
import TableHeader from "../shared/TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import { toast } from "react-hot-toast";
import { deleteAuthor } from "../../../lib/actions/authors";
import { useRouter } from "next/navigation";
import MobileAuthorCard from "./MobileAuthorCard";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface AuthorsTableClientProps {
  authors: Author[];
  searchQuery?: string;
}

export default function AuthorsTableClient({
  authors,
}: AuthorsTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Author>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [mounted, setMounted] = useState(false);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(authors.length / itemsPerPage);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSort = (field: keyof Author) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (author: Author) => {
    router.push(`/dashboard/author/${author.id}/edit`);
  };

  const handleDelete = async (id: number, authorName: string) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-2">
              Are you sure you want to delete author "{authorName}"?
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
      const result = await deleteAuthor(id);
      if (!result.success) {
        toast.error(
          <div>
            <p className="font-bold">Failed to delete author</p>
            <p className="text-sm">{result.error}</p>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.success("Author deleted successfully");
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting author:", error);
      toast.error(
        <div>
          <p className="font-bold">
            An error occurred while deleting the author
          </p>
          <p className="text-sm">Please try again later</p>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Get table columns
  const columns = getTableColumns(
    currentPage,
    itemsPerPage,
    handleDelete,
    isDeleting
  );

  // Sort authors
  const sortedAuthors = [...authors].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (
      aValue === null ||
      aValue === undefined ||
      bValue === null ||
      bValue === undefined
    )
      return 0;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate authors
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAuthors = sortedAuthors.slice(
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
            {/* Mobile View */}
            <div className="md:hidden">
              {paginatedAuthors.map((author, index) => (
                <div
                  key={author.id}
                  className="mb-4 w-full rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-zinc-200/50"
                >
                  {/* Header with ID and Name */}
                  <div className="border-b border-gray-100 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-gray-500">
                        #{(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {author.name}
                      </h3>
                    </div>
                  </div>

                  {/* Author Details */}
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base font-medium text-gray-500">
                          Description
                        </span>
                        <p className="mt-1 text-base text-gray-900">
                          {author.description || "-"}
                        </p>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base font-medium text-gray-500">
                          Bio
                        </span>
                        <p className="mt-1 text-base text-gray-900">
                          {author.bio || "-"}
                        </p>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base font-medium text-gray-500">
                          Created
                        </span>
                        <p className="mt-1 text-base text-gray-900">
                          {new Date(author.created_at).toLocaleDateString(
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
                          {new Date(author.updated_at).toLocaleDateString(
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
                        onClick={() => handleEdit(author)}
                        className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(author.id, author.name)}
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
              {paginatedAuthors.map((author, index) => (
                <div
                  key={author.id}
                  className="mb-4 w-full rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-zinc-200/50"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-medium text-gray-500">
                          #{(currentPage - 1) * itemsPerPage + index + 1}
                        </span>
                        <h3 className="text-base font-medium text-gray-900">
                          {author.name}
                        </h3>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(author)}
                          className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(author.id, author.name)}
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
                          {author.description || "-"}
                        </span>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base text-gray-500">Bio:</span>
                        <span className="ml-2 text-base text-gray-900">
                          {author.bio || "-"}
                        </span>
                      </div>
                      <div className="transition-colors duration-200 hover:bg-gray-50/50 rounded-md p-1">
                        <span className="text-base text-gray-500">
                          Created:
                        </span>
                        <span className="ml-2 text-base text-gray-900">
                          {new Date(author.created_at).toLocaleDateString(
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
                          {new Date(author.updated_at).toLocaleDateString(
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
                authors={paginatedAuthors}
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
        totalItems={authors.length}
      />
    </div>
  );
}
