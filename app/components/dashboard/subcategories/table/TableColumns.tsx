"use client";

import { SubCategory } from "@/app/lib/definition";
import { Column } from "@/app/components/dashboard/shared/table";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";
import { formatDateWithMonth } from "@/app/lib/utils/dateFormatter";

export const getTableColumns = (): Column<
  SubCategory & { sequence?: number; actions?: never }
>[] => [
  {
    field: "sequence",
    label: "Sequence",
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
          maxWords={12}
          className="text-sm text-gray-500"
        />
      </div>
    ),
  },
  {
    field: "category_name",
    label: "Category",
    sortable: true,
    render: (value) => <span className="text-sm text-gray-500">{value}</span>,
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
  {
    field: "actions",
    label: "Action",
    sortable: false,
  },
];
