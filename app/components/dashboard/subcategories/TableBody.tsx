"use client";

import { Subcategory } from "../../../type/definitions";

interface TableBodyProps {
  subcategories: Subcategory[];
  columns: {
    header: string;
    accessorKey: keyof Subcategory;
    cell?: (props: any) => React.ReactNode;
  }[];
  currentPage: number;
  itemsPerPage: number;
}

export default function TableBody({
  subcategories,
  columns,
  currentPage,
  itemsPerPage,
}: TableBodyProps) {
  return (
    <tbody className="bg-white divide-y divide-zinc-300">
      {subcategories.map((subcategory, index) => (
        <tr
          key={subcategory.id}
          className={`hover:bg-zinc-50 transition-colors ${
            index === 0
              ? "rounded-t-lg"
              : index === subcategories.length - 1
              ? "rounded-b-lg"
              : ""
          }`}
        >
          {columns.map((column) => (
            <td
              key={`${subcategory.id}-${column.header}`}
              className="px-3 py-4 text-sm text-zinc-600 font-medium text-left"
            >
              {column.cell
                ? column.cell({
                    getValue: () => subcategory[column.accessorKey],
                    row: { original: subcategory, index },
                  })
                : subcategory[column.accessorKey]?.toString() || ""}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
