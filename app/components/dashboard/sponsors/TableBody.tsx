import { Sponsor } from "../../../lib/definition";

interface Column {
  accessorKey: keyof Sponsor | "sequence" | "actions";
  cell: (info: {
    getValue: () => any;
    row: { original: Sponsor; index: number };
  }) => React.ReactNode;
}

interface TableBodyProps {
  sponsors: Sponsor[];
  columns: Column[];
  currentPage: number;
  itemsPerPage: number;
}

export default function TableBody({
  sponsors,
  columns,
  currentPage,
  itemsPerPage,
}: TableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {sponsors.map((sponsor, index) => (
        <tr
          key={sponsor.id}
          className="hover:bg-gray-100 transition-colors duration-150"
        >
          {columns.map((column, colIndex) => {
            const isActionsColumn = column.accessorKey === "actions";
            const isSequenceColumn = column.accessorKey === "sequence";
            const isMobileVisible = ["id", "name", "actions"].includes(
              column.accessorKey
            );

            return (
              <td
                key={colIndex}
                className={`whitespace-nowrap ${
                  isSequenceColumn ? "px-2 py-2" : "px-3 py-3"
                } text-xs ${isActionsColumn ? "text-center" : ""} ${
                  isMobileVisible ? "table-cell" : "hidden md:table-cell"
                }`}
              >
                {column.cell({
                  getValue: () => sponsor[column.accessorKey as keyof Sponsor],
                  row: { original: sponsor, index },
                })}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
