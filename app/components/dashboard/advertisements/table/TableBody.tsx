import { Advertisement } from "@/app/lib/definition";

interface Column {
  accessorKey: keyof Advertisement | "sequence" | "actions";
  label: string;
  sortable?: boolean;
}

interface TableBodyProps {
  advertisements: Advertisement[];
  columns: Column[];
}

export default function TableBody({ advertisements, columns }: TableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {advertisements.map((advertisement, index) => (
        <tr
          key={advertisement.id}
          className="hover:bg-gray-100 transition-colors duration-150"
        >
          {columns.map((column) => {
            const isMobileVisible = ["id", "name", "actions"].includes(
              column.accessorKey
            );
            return (
              <td
                key={column.accessorKey}
                className={`${
                  column.accessorKey === "actions"
                    ? "relative py-2 pl-4 pr-2 text-center"
                    : column.accessorKey === "sequence"
                    ? "px-2 py-2 text-left text-xs sm:text-sm"
                    : "px-3 py-3 text-left text-xs sm:text-sm"
                } ${isMobileVisible ? "table-cell" : "hidden md:table-cell"}`}
              >
                {column.accessorKey === "sequence" ? (
                  index + 1
                ) : column.accessorKey === "actions" ? (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        // Handle edit
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        // Handle delete
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <span>
                    {(() => {
                      const value =
                        advertisement[
                          column.accessorKey as keyof Advertisement
                        ];
                      if (value instanceof Date) {
                        return value.toLocaleDateString();
                      }
                      return value?.toString() || "";
                    })()}
                  </span>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
