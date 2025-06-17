"use client";

import { Category } from "@/app/lib/definition";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Column } from "@/app/components/dashboard/shared/table/TableTypes";

interface UseTableColumnsProps {
  isDeleting: boolean;
  onDelete: (id: number, name: string) => void;
}

export function useTableColumns({ isDeleting, onDelete }: UseTableColumnsProps): Column<Category>[] {
  return [
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
    {
      field: "id",
      label: "Actions",
      sortable: false,
      render: (_value: string, category: Category) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(category.id, category.name)}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];
} 