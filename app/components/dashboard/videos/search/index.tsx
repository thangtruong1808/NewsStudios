"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useState, useEffect } from "react";

interface VideosSearchProps {
  onSearch: (term: string) => void;
}

export default function VideosSearch({ onSearch }: VideosSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
