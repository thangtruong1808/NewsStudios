import { SubCategory as Subcategory } from "../../../lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import DeleteSubcategoryButton from "./DeleteSubcategoryButton";

export function getTableColumns(
  currentPage: number,
  itemsPerPage: number,
  handleDelete: (id: number, name: string) => void,
  isDeleting: boolean
) {
  return [
    {
      header: (
        <div className="text-left text-xs font-medium text-gray-900 sm:text-sm">
          #
        </div>
      ),
      accessorKey: "id" as keyof Subcategory,
      cell: (value: any, index: number) => (
        <div className="text-left text-xs text-gray-500 sm:text-sm px-2">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </div>
      ),
    },
    {
      header: (
        <div className="text-left text-xs font-medium text-gray-900 sm:text-sm">
          Name
        </div>
      ),
      accessorKey: "name" as keyof Subcategory,
      cell: (value: string) => (
        <div className="whitespace-nowrap text-xs font-medium text-gray-900 sm:text-sm">
          {value}
        </div>
      ),
    },
    {
      header: (
        <div className="text-left text-xs font-medium text-gray-900 sm:text-sm">
          Description
        </div>
      ),
      accessorKey: "description" as keyof Subcategory,
      cell: (value: string | null) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {value || "N/A"}
        </div>
      ),
    },
    {
      header: (
        <div className="text-left text-xs font-medium text-gray-900 sm:text-sm">
          Category
        </div>
      ),
      accessorKey: "category_name" as keyof Subcategory,
      cell: (value: string) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {value || "N/A"}
        </div>
      ),
    },
    {
      header: (
        <div className="text-left text-xs font-medium text-gray-900 sm:text-sm">
          Created At
        </div>
      ),
      accessorKey: "created_at" as keyof Subcategory,
      cell: (value: string) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: (
        <div className="text-left text-xs font-medium text-gray-900 sm:text-sm">
          Updated At
        </div>
      ),
      accessorKey: "updated_at" as keyof Subcategory,
      cell: (value: string) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: (
        <div className="text-center text-xs font-medium text-gray-900 sm:text-sm">
          Actions
        </div>
      ),
      accessorKey: "id" as keyof Subcategory,
      cell: (value: any, index: number, subcategory: Subcategory) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          <div className="flex justify-center gap-4">
            <button
              onClick={() =>
                (window.location.href = `/dashboard/subcategories/${subcategory.id}/edit`)
              }
              className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-100"
            >
              <PencilIcon className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={() => handleDelete(subcategory.id, subcategory.name)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100 disabled:opacity-50"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      ),
    },
  ];
}
