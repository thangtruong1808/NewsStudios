import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

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
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <div className="invisible group-hover:visible">
          <svg
            className="h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }

    return sortDirection === "asc" ? (
      <svg
        className="h-4 w-4 text-indigo-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        className="h-4 w-4 text-indigo-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          <span>#</span>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          <button
            onClick={() => onSort("id")}
            className="group inline-flex items-center space-x-1 hover:text-gray-900"
          >
            <span>ID</span>
            {getSortIcon("id")}
          </button>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          <button
            onClick={() => onSort("sponsor_name")}
            className="group inline-flex items-center space-x-1 hover:text-gray-900"
          >
            <span>Sponsor</span>
            {getSortIcon("sponsor_name")}
          </button>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          <button
            onClick={() => onSort("ad_type")}
            className="group inline-flex items-center space-x-1 hover:text-gray-900"
          >
            <span>Type</span>
            {getSortIcon("ad_type")}
          </button>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          <button
            onClick={() => onSort("article_title")}
            className="group inline-flex items-center space-x-1 hover:text-gray-900"
          >
            <span>Article</span>
            {getSortIcon("article_title")}
          </button>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          <button
            onClick={() => onSort("category_name")}
            className="group inline-flex items-center space-x-1 hover:text-gray-900"
          >
            <span>Category</span>
            {getSortIcon("category_name")}
          </button>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          <button
            onClick={() => onSort("start_date")}
            className="group inline-flex items-center space-x-1 hover:text-gray-900"
          >
            <span>Start Date</span>
            {getSortIcon("start_date")}
          </button>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          <button
            onClick={() => onSort("end_date")}
            className="group inline-flex items-center space-x-1 hover:text-gray-900"
          >
            <span>End Date</span>
            {getSortIcon("end_date")}
          </button>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Actions
        </th>
      </tr>
    </thead>
  );
}
