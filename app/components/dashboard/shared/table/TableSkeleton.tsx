import { Column } from "./TableTypes";

interface TableSkeletonProps<T> {
  columns: Column<T>[];
  itemsPerPage?: number;
  showHeader?: boolean;
}

export default function TableSkeleton<T>({
  columns,
  itemsPerPage = 5,
  showHeader = true,
}: TableSkeletonProps<T>) {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              {showHeader && (
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-gray-200 bg-white">
                {Array.from({ length: itemsPerPage }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                      >
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
