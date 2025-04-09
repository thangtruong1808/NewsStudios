import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function Search({
  placeholder = "Search...",
  value,
  onChange,
}: SearchProps) {
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search-field" className="sr-only">
        Search
      </label>
      <MagnifyingGlassIcon
        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
        aria-hidden="true"
      />
      <input
        id="search-field"
        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
        placeholder={placeholder}
        type="search"
        name="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
