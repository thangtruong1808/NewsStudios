import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface TableHeaderProps {
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export default function TableHeader({
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  const columns = [
    { key: "sequence", label: "#", sortable: false },
    { key: "sponsor_name", label: "Sponsor", sortable: true },
    { key: "ad_type", label: "Type", sortable: true },
    { key: "article_title", label: "Article", sortable: true },
    { key: "category_name", label: "Category", sortable: true },
    { key: "ad_content", label: "Content", sortable: true },
    { key: "start_date", label: "Start Date", sortable: true },
    { key: "end_date", label: "End Date", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ];

  return (
    <thead className="rounded-lg text-left text-sm font-normal bg-zinc-200">
      <tr>
        {columns.map((column) => {
          const isMobileVisible = ["id", "name", "actions"].includes(
            column.key
          );
          return (
            <th
              key={column.key}
              scope="col"
              className={`${
                column.key === "actions"
                  ? "relative py-2 pl-4 pr-2 text-center border-b border-zinc-300"
                  : column.key === "sequence"
                  ? "px-2 py-3 text-left text-xs font-medium text-gray-900 sm:text-sm border-b border-zinc-300"
                  : `px-3 py-3 text-left text-xs font-medium text-gray-900 sm:text-sm ${
                      column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    } border-b border-zinc-300`
              } ${isMobileVisible ? "table-cell" : "hidden md:table-cell"}`}
              onClick={() => column.sortable && onSort(column.key)}
            >
              <div
                className={`group inline-flex items-center ${
                  column.key === "actions" ? "justify-center w-full" : ""
                }`}
              >
                <span
                  className={
                    column.key === "actions" ? "font-medium text-center" : ""
                  }
                >
                  {column.label}
                </span>
                {column.sortable && sortField === column.key && (
                  <span className="ml-1 text-gray-500">
                    {sortDirection === "asc" ? (
                      <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
