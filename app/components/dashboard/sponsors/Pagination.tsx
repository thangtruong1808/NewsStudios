import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

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
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 2) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-2 py-2 sm:px-4 sm:py-3">
      <div className="flex flex-1 items-center justify-between">
        <div className="hidden sm:block">
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
        <div className="flex w-full sm:w-auto justify-center">
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
              <ChevronLeftIcon
                className="h-3 w-3 sm:h-5 sm:w-5"
                aria-hidden="true"
              />
              <ChevronLeftIcon
                className="h-3 w-3 sm:h-5 sm:w-5 -ml-0.5 sm:-ml-1"
                aria-hidden="true"
              />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-1.5 py-1.5 sm:px-2 sm:py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon
                className="h-3 w-3 sm:h-5 sm:w-5"
                aria-hidden="true"
              />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={`page-${page}`}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold ${
                    page === currentPage
                      ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span
                  key={`ellipsis-${index}`}
                  className="relative inline-flex items-center px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                >
                  ...
                </span>
              )
            )}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-1.5 py-1.5 sm:px-2 sm:py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon
                className="h-3 w-3 sm:h-5 sm:w-5"
                aria-hidden="true"
              />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-1.5 py-1.5 sm:px-2 sm:py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Last</span>
              <ChevronRightIcon
                className="h-3 w-3 sm:h-5 sm:w-5"
                aria-hidden="true"
              />
              <ChevronRightIcon
                className="h-3 w-3 sm:h-5 sm:w-5 -ml-0.5 sm:-ml-1"
                aria-hidden="true"
              />
            </button>
          </nav>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs sm:text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
      </div>
      <div className="sm:hidden">
        <p className="text-xs text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
    </div>
  );
}
