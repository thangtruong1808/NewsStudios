"use client";

import { useState, useEffect } from "react";
import { Sponsor } from "../../../login/login-definitions";
import { getTableColumns } from "./TableColumns";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import { toast } from "react-hot-toast";
import { deleteSponsor } from "../../../lib/actions/sponsors";
import { useRouter } from "next/navigation";
import Search from "../search";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSponsors, setFilteredSponsors] = useState<Sponsor[]>(sponsors);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredSponsors.length / itemsPerPage);

  // Filter sponsors based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSponsors(sponsors);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = sponsors.filter((sponsor) =>
        sponsor.name.toLowerCase().includes(query)
      );
      setFilteredSponsors(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchQuery, sponsors]);

  const handleSort = (field: keyof Sponsor) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: number, sponsorName: string) => {
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const columns = getTableColumns(
    currentPage,
    itemsPerPage,
    handleDelete,
    isDeleting
  );

  // Sort sponsors
  const sortedSponsors = [...filteredSponsors].sort((a, b) => {
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

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <Search
          placeholder="Search sponsors by name..."
          onChange={handleSearch}
        />
      </div>

      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
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
        totalItems={filteredSponsors.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
