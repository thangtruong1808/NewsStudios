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
import TableHeader from "./table/TableHeader";
import TableRow from "./table/TableRow";
import Pagination from "./table/Pagination";
import MobileView from "./table/MobileView";

// Add this interface to extend Advertisement with additional properties
interface AdvertisementWithDetails extends Advertisement {
  sponsor_name: string;
  article_title?: string;
  category_name?: string;
}

interface AdvertisementsTableClientProps {
  advertisements: AdvertisementWithDetails[];
}

export default function AdvertisementsTableClient({
  advertisements,
}: AdvertisementsTableClientProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;
  const totalPages = Math.ceil(advertisements.length / itemsPerPage);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this advertisement?"
    );

    if (confirmed) {
      const { error } = await deleteAdvertisement(id);

      if (error) {
        toast.error("Failed to delete advertisement");
      } else {
        toast.success("Advertisement deleted successfully");
        router.refresh();
      }
    }
  };

  const sortedAdvertisements = [...advertisements].sort((a, b) => {
    const aValue = a[sortField as keyof Advertisement];
    const bValue = b[sortField as keyof Advertisement];

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

  const paginatedAdvertisements = sortedAdvertisements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { key: "sponsor_name", label: "Sponsor" },
    { key: "article_title", label: "Article" },
    { key: "category_name", label: "Category" },
    { key: "ad_type", label: "Type" },
    { key: "ad_content", label: "Content" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <MobileView
            advertisements={paginatedAdvertisements}
            onDelete={handleDelete}
          />
          <div className="hidden sm:block">
            <table className="min-w-full divide-y divide-gray-300">
              <TableHeader
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <tbody className="divide-y divide-gray-200">
                {paginatedAdvertisements.map((advertisement, index) => (
                  <TableRow
                    key={advertisement.id}
                    advertisement={advertisement}
                    onDelete={handleDelete}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
