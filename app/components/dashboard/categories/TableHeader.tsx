"use client";

import { Category } from "../../../type/definitions";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface TableHeaderProps {
  sortField: keyof Category;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Category) => void;
}

export default function TableHeader({
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th
          scope="col"
          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
          onClick={() => onSort("id")}
        >
          <div className="flex items-center">
            ID
            {sortField === "id" && (
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
        <th
          scope="col"
          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
          onClick={() => onSort("name")}
        >
          <div className="flex items-center">
            Name
            {sortField === "name" && (
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
        <th
          scope="col"
          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
          onClick={() => onSort("description")}
        >
          <div className="flex items-center">
            Description
            {sortField === "description" && (
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
        <th
          scope="col"
          className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
        >
          Actions
        </th>
      </tr>
    </thead>
  );
}
