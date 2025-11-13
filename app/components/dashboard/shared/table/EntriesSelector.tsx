"use client";

interface EntriesSelectorProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  onItemsPerPageChange: (_: { limit: number }) => void;
}

// Description: Render selectable page size controls with a summary of visible entries.
// Data created: 2024-11-13
// Author: thangtruong
export default function EntriesSelector({
  itemsPerPage,
  totalItems,
  currentPage,
  onItemsPerPageChange,
}: EntriesSelectorProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm">Show</span>
        <select
          value={itemsPerPage}
          onChange={(event) =>
            onItemsPerPageChange({ limit: Number(event.target.value) })
          }
          className="rounded-md border-gray-300 text-sm focus:border-violet-500 focus:ring-violet-500"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span className="text-sm">entries</span>
      </div>
      <div className="text-sm mt-2 sm:mt-0">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
    </div>
  );
}
