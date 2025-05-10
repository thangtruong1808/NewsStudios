import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) endPage = 4;
      if (currentPage >= totalPages - 1) startPage = totalPages - 3;

      if (startPage > 2) pageNumbers.push("...");
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (endPage < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-2 py-2 sm:px-4 sm:py-3">
      <div className="flex flex-1 items-center justify-around w-full">
        <div>
          <p className="text-xs sm:text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div className="flex justify-center">
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-1.5 py-1.5 sm:px-2 sm:py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">First</span>
              <ChevronDoubleLeftIcon className="h-3 w-3 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-1.5 py-1.5 sm:px-2 sm:py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-3 w-3 sm:h-5 sm:w-5" />
            </button>
            {getPageNumbers().map((pageNumber, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof pageNumber === "number" && onPageChange(pageNumber)
                }
                disabled={typeof pageNumber !== "number"}
                className={`relative inline-flex items-center px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold ${
                  currentPage === pageNumber
                    ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-1.5 py-1.5 sm:px-2 sm:py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-3 w-3 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-1.5 py-1.5 sm:px-2 sm:py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Last</span>
              <ChevronDoubleRightIcon className="h-3 w-3 sm:h-5 sm:w-5" />
            </button>
          </nav>
        </div>
        <div>
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
      </div>
    </div>
  );
}
