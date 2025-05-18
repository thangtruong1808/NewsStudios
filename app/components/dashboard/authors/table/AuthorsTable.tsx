"use client";

import { Table } from "@/app/components/dashboard/shared/table";
import { Author } from "@/app/lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Column } from "@/app/components/dashboard/shared/table/TableTypes";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";

interface AuthorsTableProps {
  authors: Author[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  sortField: keyof (Author & { sequence?: number });
  sortDirection: "asc" | "desc";
  searchQuery: string;
  isDeleting: boolean;
  isLoading: boolean;
  onSort: (field: keyof (Author & { sequence?: number })) => void;
  onPageChange: (page: number) => void;
  onEdit: (author: Author) => void;
  onDelete: (author: Author) => void;
  onItemsPerPageChange: (limit: number) => void;
}

export default function AuthorsTable({
  authors,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  sortField,
  sortDirection,
  searchQuery,
  isDeleting,
  isLoading,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  onItemsPerPageChange,
}: AuthorsTableProps) {
  // Define table columns with sorting and rendering options
  const columns: Column<Author & { sequence?: number; actions?: never }>[] = [
    {
      field: "sequence",
      label: "#",
      sortable: false,
    },
    {
      field: "name",
      label: "Name",
      sortable: true,
    },
    {
      field: "description",
      label: "Description",
      sortable: true,
      render: (value: string) => (
        <div className="w-64">
          <ExpandableContent
            content={value || "No description"}
            maxWords={20}
          />
        </div>
      ),
    },
    {
      field: "articles_count",
      label: "Articles",
      sortable: true,
      render: (value: string) => (
        <div className="w-20">
          <span className="text-sm text-zinc-500 whitespace-nowrap text-left">
            {parseInt(value) || 0}
          </span>
        </div>
      ),
    },
    {
      field: "bio",
      label: "Bio",
      sortable: true,
      render: (value) => (
        <div className="w-64">
          <ExpandableContent content={value || "No bio"} maxWords={20} />
        </div>
      ),
    },
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
      render: (value: string) => (
        <div className="w-32">
          <span className="text-sm text-zinc-500 whitespace-nowrap text-left">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
      render: (value: string) => (
        <div className="w-32">
          <span className="text-sm text-zinc-500 whitespace-nowrap text-left">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      field: "actions",
      label: "Actions",
      sortable: false,
      render: (_, author) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(author)}
            className="text-blue-600 hover:text-blue-800"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(author)}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  // Add sequence numbers to authors
  const authorsWithSequence = authors.map((author, index) => ({
    ...author,
    sequence: (currentPage - 1) * itemsPerPage + index + 1,
  }));

  return (
    <div className="mt-8">
      <Table
        data={authorsWithSequence}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
        onPageChange={onPageChange}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={isDeleting}
        onItemsPerPageChange={onItemsPerPageChange}
        searchQuery={searchQuery}
        isLoading={isLoading}
      />
    </div>
  );
}
