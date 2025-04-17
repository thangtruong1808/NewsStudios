"use client";

declare global {
  interface Window {
    confirm: (message?: string) => boolean;
  }
}

import { useState, useEffect } from "react";
import { Sponsor } from "../../../lib/definition";
import { getTableColumns } from "./TableColumns";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import { toast } from "react-hot-toast";
import { deleteSponsor } from "../../../lib/actions/sponsors";
import { useRouter } from "next/navigation";
import MobileSponsorCard from "./MobileSponsorCard";

interface SponsorsTableClientProps {
  sponsors: Sponsor[];
}

export default function SponsorsTableClient({
  sponsors,
}: SponsorsTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Sponsor>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [mounted, setMounted] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sponsors.length / itemsPerPage);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field as keyof Sponsor);
      setSortDirection("asc");
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    router.push(`/dashboard/sponsor/${sponsor.id}/edit`);
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-2">
              Are you sure you want to delete sponsor "{name}"?
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
              >
                Delete
              </button>
              <button
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const { error } = await deleteSponsor(id);
      if (error) {
        toast.error(`Failed to delete sponsor: ${error}`);
      } else {
        toast.success("Sponsor deleted successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred while deleting the sponsor");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = getTableColumns(
    currentPage,
    itemsPerPage,
    handleDelete,
    isDeleting
  );

  // Sort sponsors
  const sortedSponsors = [...sponsors].sort((a, b) => {
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

  // Paginate sponsors
  const paginatedSponsors = sortedSponsors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50">
            <div className="md:hidden">
              {paginatedSponsors.map((sponsor) => (
                <MobileSponsorCard
                  key={sponsor.id}
                  sponsor={sponsor}
                  onEdit={handleEdit}
                  onDelete={(sponsor) => handleDelete(sponsor.id, sponsor.name)}
                />
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <TableHeader
                columns={columns}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <TableBody
                sponsors={paginatedSponsors}
                columns={columns}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={sponsors.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
