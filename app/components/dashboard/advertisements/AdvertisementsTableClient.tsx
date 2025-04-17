"use client";

import { useState } from "react";
import { Advertisement } from "../../../lib/definition";
import { formatDate } from "../../../lib/utils/dateUtils";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { deleteAdvertisement } from "../../../lib/actions/advertisements";
import { useRouter } from "next/navigation";
import { Toast } from "react-hot-toast";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface AdvertisementsTableClientProps {
  advertisements: Advertisement[];
}

export default function AdvertisementsTableClient({
  advertisements = [],
}: AdvertisementsTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Advertisement>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 10;
  const advertisementsArray = Array.isArray(advertisements)
    ? advertisements
    : [];
  const totalPages = Math.ceil(advertisementsArray.length / itemsPerPage);

  const handleSort = (field: keyof Advertisement) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: number, adType: string) => {
    toast((t: Toast) => (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium">
          Are you sure you want to delete this {adType} advertisement?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const result = await deleteAdvertisement(id);
                if (result.error) {
                  toast.error(result.error);
                } else {
                  toast.success("Advertisement deleted successfully");
                  router.refresh();
                }
              } catch (error) {
                toast.error("Failed to delete advertisement");
              }
            }}
            className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  // Sort advertisements
  const sortedAdvertisements = [...advertisementsArray].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === "asc"
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  // Paginate advertisements
  const paginatedAdvertisements = sortedAdvertisements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate page numbers to display
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

  const getSortIcon = (field: keyof Advertisement) => {
    if (sortField !== field) return "";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50">
            {/* Mobile view */}
            <div className="md:hidden">
              {paginatedAdvertisements.map((ad) => (
                <div
                  key={ad.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p className="font-medium text-gray-900">
                          ID: {ad.id} - {ad.sponsor_name} - {ad.ad_type}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">{ad.ad_content}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(ad.start_date)} - {formatDate(ad.end_date)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/advertisements/${ad.id}/edit`}
                        className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(ad.id, ad.ad_type)}
                        className="rounded border border-red-500 px-2 py-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <button
                      className="group inline-flex"
                      onClick={() => handleSort("id")}
                    >
                      ID{" "}
                      <span className="ml-1 text-gray-500">
                        {getSortIcon("id")}
                      </span>
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <button
                      className="group inline-flex"
                      onClick={() => handleSort("sponsor_name")}
                    >
                      Sponsor{" "}
                      <span className="ml-1 text-gray-500">
                        {getSortIcon("sponsor_name")}
                      </span>
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <button
                      className="group inline-flex"
                      onClick={() => handleSort("ad_type")}
                    >
                      Type{" "}
                      <span className="ml-1 text-gray-500">
                        {getSortIcon("ad_type")}
                      </span>
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Content
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <button
                      className="group inline-flex"
                      onClick={() => handleSort("start_date")}
                    >
                      Start Date{" "}
                      <span className="ml-1 text-gray-500">
                        {getSortIcon("start_date")}
                      </span>
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <button
                      className="group inline-flex"
                      onClick={() => handleSort("end_date")}
                    >
                      End Date{" "}
                      <span className="ml-1 text-gray-500">
                        {getSortIcon("end_date")}
                      </span>
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedAdvertisements.map((ad, index) => (
                  <tr
                    key={ad.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {ad.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {ad.sponsor_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {ad.ad_type}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <div className="max-w-xs truncate">{ad.ad_content}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDate(ad.start_date)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDate(ad.end_date)}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/advertisements/${ad.id}/edit`}
                          className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(ad.id, ad.ad_type)}
                          className="rounded border border-red-500 px-2 py-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-2 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-1 items-center justify-around w-full">
          <div>
            <p className="text-xs sm:text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{(currentPage - 1) * 10 + 1}</span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * 10, totalPages * 10)}
              </span>{" "}
              of <span className="font-medium">{totalPages * 10}</span> results
            </p>
          </div>
          <div className="flex justify-center">
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-1.5 py-1.5 sm:px-2 sm:py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">First</span>
                <ChevronDoubleLeftIcon className="h-3 w-3 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
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
                    typeof pageNumber === "number" && setCurrentPage(pageNumber)
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
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-1.5 py-1.5 sm:px-2 sm:py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-3 w-3 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-1.5 py-1.5 sm:px-2 sm:py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Last</span>
                <ChevronDoubleRightIcon className="h-3 w-3 sm:h-5 sm:w-5" />
              </button>
            </nav>
          </div>
          <div className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
