"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

/* eslint-disable no-unused-vars */
interface VideosSearchProps {
  onSearch: ({ term }: { term: string }) => void;
  defaultValue?: string;
}
/* eslint-enable no-unused-vars */

// Description: Debounced search input for filtering dashboard video listings by metadata.
// Data created: 2024-11-13
// Author: thangtruong
export default function VideosSearch({
  onSearch,
  defaultValue = "",
}: VideosSearchProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);

  useEffect(() => {
    setSearchTerm(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSearch({ term: searchTerm });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch({ term: "" });
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="peer block w-full rounded-lg border border-gray-200 py-[10px] pl-10 pr-10 ring-1 ring-inset ring-gray-400 text-sm outline-1 placeholder:text-gray-500"
          placeholder="Search videos by article ID, title or description..."
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
