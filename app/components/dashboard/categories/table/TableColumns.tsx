"use client";

import { Category } from "@/app/lib/definition";
import { Column } from "@/app/components/dashboard/shared/table";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";
import { formatDateWithMonth } from "@/app/lib/utils/dateFormatter";
import { useSession } from "next-auth/react";

export const useTableColumns = (): Column<
  Category & { sequence?: number; actions?: never }
>[] => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const columns: Column<Category & { sequence?: number; actions?: never }>[] = [
    {
      field: "sequence",
      label: "#",
      sortable: false,
      render: (value) => <span className="text-sm text-gray-500">{value}</span>,
    },
    {
      field: "name",
      label: "Name",
      sortable: true,
      render: (value) => <span className="text-sm text-gray-500">{value}</span>,
    },
    {
      field: "description",
      label: "Description",
      sortable: true,
      render: (value) => (
        <div className="w-64">
          <ExpandableContent
            content={value || "No description"}
            maxWords={10}
            className="text-sm text-gray-500"
          />
        </div>
      ),
    },
    {
      field: "subcategories_count",
      label: "Subcategories",
      sortable: true,
      render: (value) => (
        <div className="w-24">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      field: "articles_count",
      label: "Articles",
      sortable: true,
      render: (value) => (
        <div className="w-24">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {formatDateWithMonth(value)}
        </span>
      ),
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {formatDateWithMonth(value)}
        </span>
      ),
    },
  ];

  // Only add actions column for admin users
  if (isAdmin) {
    columns.push({
      field: "actions",
      label: "Action",
      sortable: false,
    });
  }

  return columns;
};
