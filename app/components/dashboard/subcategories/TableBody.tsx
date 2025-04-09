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
    <tbody className="bg-white divide-y divide-gray-200">
      {subcategories.map((subcategory, index) => (
        <tr key={subcategory.id}>
          {columns.map((column) => (
            <td
              key={`${subcategory.id}-${column.header}`}
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
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
