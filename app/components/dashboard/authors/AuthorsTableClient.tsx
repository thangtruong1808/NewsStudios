"use client";

declare global {
  interface Window {
    confirm: (message?: string) => boolean;
  }
}

import { useState, useEffect } from "react";
import { Author } from "../../../type/definitions";
import { getTableColumns } from "./TableColumns";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import { toast } from "react-hot-toast";
import { deleteAuthor } from "../../../lib/actions/authors";
import { useRouter } from "next/navigation";
import MobileAuthorCard from "./MobileAuthorCard";

interface AuthorsTableClientProps {
  authors: Author[];
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

  const itemsPerPage = 10;
  const totalPages = Math.ceil(authors.length / itemsPerPage);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field as keyof Author);
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
      const { success, error } = await deleteAuthor(id);
      if (error) {
        toast.error(`Failed to delete author: ${error}`);
      } else if (success) {
        toast.success("Author deleted successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred while deleting the author");
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
            {/* Mobile view */}
            <div className="md:hidden">
              {paginatedAuthors.map((author) => (
                <MobileAuthorCard
                  key={author.id}
                  author={author}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
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
