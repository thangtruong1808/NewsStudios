"use client";

import { Subcategory } from "../../../login/login-definitions";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface TableHeaderProps {
  columns: {
    header: string;
    accessorKey: keyof Subcategory;
    cell?: (props: any) => React.ReactNode;
  }[];
  sortField: keyof Subcategory | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Subcategory) => void;
}

export default function TableHeader({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th
            key={column.header}
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => onSort(column.accessorKey)}
          >
            <div className="flex items-center text-left">
              {column.header}
              {sortField === column.accessorKey && (
                <span className="ml-1">
                  {sortDirection === "asc" ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
