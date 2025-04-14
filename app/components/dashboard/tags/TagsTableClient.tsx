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
            <div className="md:hidden">
              {paginatedTags.map((tag) => (
                <div
                  key={tag.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p className="font-medium text-gray-900">
                          ID: {tag.id} - {tag.name}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">{tag.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/tags/${tag.id}/edit`}
                        className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(tag.id, tag.name)}
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
            <table className="hidden min-w-full text-gray-900 md:table">
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
