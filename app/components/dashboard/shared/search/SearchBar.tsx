"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Props interface for SearchBar component
 * @property searchQuery - Current search query string
 * @property setSearchQuery - Function to update search query
 * @property placeholder - Optional placeholder text for search input
 */
interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

/**
 * SearchBar Component
 * A reusable search input component with:
 * - Search icon on the left
 * - Clear button (X) that appears when there's text
 * - Immediate search updates on input change
 * - Responsive styling with focus states
 */
export default function SearchBar({
  searchQuery,
  setSearchQuery,
  placeholder = "Search...",
}: SearchBarProps) {
  // Clear search input and trigger search update
  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative">
      <div className="relative">
        {/* Search icon */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        {/* Search input field */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        {/* Clear button - only shown when there's text */}
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
