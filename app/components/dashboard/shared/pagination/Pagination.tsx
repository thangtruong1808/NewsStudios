"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
  className?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  disabledButtonClassName?: string;
}

export default function Pagination({
  totalPages,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  showFirstLast = true,
  showPageNumbers = true,
  maxPageNumbers = 5,
  className = "",
  buttonClassName = "relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50",
  activeButtonClassName = "z-10 bg-indigo-50 border-indigo-500 text-indigo-600",
  disabledButtonClassName = "bg-gray-100 text-gray-400 cursor-not-allowed",
}: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;

    if (onPageChange) {
      onPageChange(pageNumber);
    } else {
      replace(createPageURL(pageNumber));
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const halfMax = Math.floor(maxPageNumbers / 2);
    let start = Math.max(1, currentPage - halfMax);
    let end = Math.min(totalPages, start + maxPageNumbers - 1);

    if (end - start + 1 < maxPageNumbers) {
      start = Math.max(1, end - maxPageNumbers + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const renderPageNumbers = () => {
    if (!showPageNumbers) return null;

    return getPageNumbers().map((page) => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`${buttonClassName} ${currentPage === page ? activeButtonClassName : ""
          }`}
        aria-current={currentPage === page ? "page" : undefined}
      >
        {page}
      </button>
    ));
  };

  return (
    <div
      className={`flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 ${className}`}
    >
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`${buttonClassName} ${currentPage <= 1 ? disabledButtonClassName : ""
            }`}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`${buttonClassName} ${currentPage >= totalPages ? disabledButtonClassName : ""
            }`}
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
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

        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          {showFirstLast && (
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage <= 1}
              className={`${buttonClassName} rounded-l-md ${currentPage <= 1 ? disabledButtonClassName : ""
                }`}
            >
              <span className="sr-only">First</span>
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          )}

          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`${buttonClassName} ${currentPage <= 1 ? disabledButtonClassName : ""
              }`}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`${buttonClassName} ${currentPage >= totalPages ? disabledButtonClassName : ""
              }`}
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          {showFirstLast && (
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage >= totalPages}
              className={`${buttonClassName} rounded-r-md ${currentPage >= totalPages ? disabledButtonClassName : ""
                }`}
            >
              <span className="sr-only">Last</span>
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
