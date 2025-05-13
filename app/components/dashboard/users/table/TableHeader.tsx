"use client";

import { User } from "../../../../lib/definition";

interface TableHeaderProps {
  sortField: keyof User;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof User) => void;
  columns?: {
    key: string;
    label: string;
    sortable: boolean;
  }[];
}

export default function TableHeader({
  sortField,
  sortDirection,
  onSort,
  columns,
}: TableHeaderProps) {
  const defaultColumns = [
    { key: "sequence", label: "#", sortable: false },
    { key: "firstname", label: "First Name", sortable: true },
    { key: "lastname", label: "Last Name", sortable: true },
    { key: "description", label: "Description", sortable: false },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ];

  const displayColumns = columns || defaultColumns;

  return (
    <thead className="rounded-lg text-left text-sm font-normal bg-zinc-200">
      <tr>
        {displayColumns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className={`px-3 py-3 font-medium border-b border-zinc-300 ${
              column.key === "actions" ? "text-center" : ""
            }`}
            onClick={() => column.sortable && onSort(column.key as keyof User)}
          >
            {column.label}{" "}
            {column.sortable && sortField === column.key && (
              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}
