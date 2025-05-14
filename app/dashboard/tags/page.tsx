"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tag } from "@/app/lib/definition";
import { getTags, deleteTag } from "@/app/lib/actions/tags";
import TagsTable from "@/app/components/dashboard/tags/table/TagsTable";
import { toast } from "react-hot-toast";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useDebounce } from "@/app/hooks/useDebounce";
import { SearchWrapper } from "@/app/components/dashboard/shared/search";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";

// Use force-dynamic to ensure fresh data
export const dynamic = "force-dynamic";

export default function TagsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] =
    useState<keyof (Tag & { sequence?: number })>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Table column definitions
  const columns = [
    {
      field: "name",
      label: "Name",
      sortable: true,
    },
    {
      field: "description",
      label: "Description",
      sortable: true,
    },
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
    },
  ];

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const result = await getTags({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchQuery,
          sortField: sortField as string,
          sortDirection,
        });

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.data) {
          setTags(result.data);
          setTotalPages(result.totalPages);
          setTotalItems(result.totalItems);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Failed to fetch tags");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearchQuery,
    sortField,
    sortDirection,
  ]);

  const handleDelete = async (tag: Tag) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    setIsDeleting(true);
    try {
      const result = await deleteTag(tag.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Tag deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error("Failed to delete tag");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    router.push(`/dashboard/tags/${tag.id}/edit`);
  };

  const handleSort = (field: keyof (Tag & { sequence?: number })) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Tags
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your content tags and categories.
            </p>
          </div>
          <Link
            href="/dashboard/tags/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Tag
          </Link>
        </div>

        <div className="mt-4">
          <div className="w-full">
            <SearchWrapper
              placeholder="Search tags..."
              onSearch={handleSearch}
              defaultValue={searchQuery}
            />
          </div>
        </div>

        <TableSkeleton columns={columns} itemsPerPage={itemsPerPage} />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Tags
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your content tags and categories.
          </p>
        </div>
        <Link
          href="/dashboard/tags/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Tag
        </Link>
      </div>

      <div className="mt-4">
        <div className="w-full">
          <SearchWrapper
            placeholder="Search tags..."
            onSearch={handleSearch}
            defaultValue={searchQuery}
          />
        </div>
      </div>

      <TagsTable
        tags={tags}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        sortField={sortField}
        sortDirection={sortDirection}
        searchQuery={searchQuery}
        isDeleting={isDeleting}
        isLoading={isLoading}
        onSort={handleSort}
        onPageChange={setCurrentPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
