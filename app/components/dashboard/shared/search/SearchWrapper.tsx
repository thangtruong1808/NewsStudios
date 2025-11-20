"use client";

import Search from "./Search";

/* eslint-disable no-unused-vars */
interface SearchWrapperProps {
  placeholder?: string;
  onSearch?: (term: string) => void;
  defaultValue?: string;
}
/* eslint-enable no-unused-vars */

// Component Info
// Description: Lightweight wrapper delivering shared search defaults for dashboard listings.
// Date updated: 2025-November-21
// Author: thangtruong
export default function SearchWrapper({
  placeholder = "Search...",
  onSearch,
  defaultValue = "",
}: SearchWrapperProps) {
  return (
    <Search
      placeholder={placeholder}
      onSearch={onSearch}
      defaultValue={defaultValue}
    />
  );
}
