"use client";

import { useState, useEffect } from "react";
import { Author } from "../../../type/definitions";
import { getTableColumns } from "./TableColumns";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteAuthor } from "../../../lib/actions/authors";
import Search from "../search";

interface AuthorsTableClientProps {
  authors: Author[];
}

export default function AuthorsTableClient({
  authors,
}: AuthorsTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Author>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>(authors);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage);

  // Filter authors based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAuthors(authors);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = authors.filter((author) =>
        author.name.toLowerCase().includes(query)
      );
      setFilteredAuthors(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchQuery, authors]);

  const handleSort = (field: keyof Author) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: number, authorName: string) => {
    setIsDeleting(true);
    try {
      const { success, error } = await deleteAuthor(id);

      if (error) {
        toast.error(error);
        return;
      }

      if (success) {
        toast.success("Author deleted successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to delete author");
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

  // Sort authors
  const sortedAuthors = [...filteredAuthors].sort((a, b) => {
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

  // Paginate authors
  const paginatedAuthors = sortedAuthors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <Search
          placeholder="Search authors by name..."
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
                authors={paginatedAuthors}
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
        totalItems={filteredAuthors.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
