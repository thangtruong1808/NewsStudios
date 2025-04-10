import { Subcategory } from "../../../login/login-definitions";
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
      header: "#",
      accessorKey: "id" as keyof Subcategory,
      cell: ({ row }: { row: { index: number } }) => {
        const index = row.index;
        return (currentPage - 1) * itemsPerPage + index + 1;
      },
    },
    {
      header: "ID",
      accessorKey: "id" as keyof Subcategory,
      cell: ({ getValue }: { getValue: () => number }) => getValue(),
    },
    {
      header: "Name",
      accessorKey: "name" as keyof Subcategory,
      cell: ({ getValue }: { getValue: () => string }) => getValue(),
    },
    {
      header: "Description",
      accessorKey: "description" as keyof Subcategory,
      cell: ({ getValue }: { getValue: () => string | null }) =>
        getValue() || "N/A",
    },
    {
      header: "Category",
      accessorKey: "category_name" as keyof Subcategory,
      cell: ({ getValue }: { getValue: () => string }) => getValue() || "N/A",
    },
    {
      header: "Actions",
      accessorKey: "id" as keyof Subcategory,
      cell: ({ row }: { row: { original: Subcategory } }) => {
        const subcategory = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Link
              href={`/dashboard/subcategories/${subcategory.id}/edit`}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <PencilIcon className="h-5 w-5" />
              <span className="sr-only">Edit {subcategory.name}</span>
            </Link>
            <DeleteSubcategoryButton
              id={subcategory.id}
              name={subcategory.name}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>
        );
      },
    },
  ];
}
