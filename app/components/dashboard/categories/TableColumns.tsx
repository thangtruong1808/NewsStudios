"use client";

import { useSession } from "next-auth/react";
import { Category } from "../../../lib/definition";
import { Column } from "./types";
import { TrashIcon } from "@heroicons/react/24/outline";

interface UseTableColumnsProps {
  currentPage: number;
  itemsPerPage: number;
  isDeleting: boolean;
  onDelete: (_id: number, _name: string) => void;
}

export function useTableColumns({ currentPage, itemsPerPage, isDeleting, onDelete }: UseTableColumnsProps): Column<Category>[] {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

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
      render: (_value: any, category: Category) => (
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
