import { Sponsor } from "../../../type/definitions";

interface Column {
  accessorKey: keyof Sponsor | "sequence";
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
    <tbody className="bg-white divide-y divide-gray-200">
      {sponsors.map((sponsor, rowIndex) => (
        <tr key={sponsor.id} className="hover:bg-gray-50">
          {columns.map((column, colIndex) => (
            <td
              key={colIndex}
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
            >
              {column.cell({
                getValue: () => sponsor[column.accessorKey as keyof Sponsor],
                row: { original: sponsor, index: rowIndex },
              })}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
