"use client";

interface EntriesSelectorProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  onItemsPerPageChange: (limit: number) => void;
}

export default function EntriesSelector({
  itemsPerPage,
  totalItems,
  currentPage,
  onItemsPerPageChange,
}: EntriesSelectorProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="rounded-md border-gray-300 text-sm focus:border-violet-500 focus:ring-violet-500"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span className="text-sm text-gray-700">entries</span>
      </div>
      <div className="text-sm text-gray-700">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
        entries
      </div>
    </div>
  );
}
