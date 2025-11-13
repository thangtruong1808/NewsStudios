"use client";

import Search from "./Search";

interface SearchWrapperProps {
  placeholder?: string;
  onSearch?: (_term: string) => void;
  defaultValue?: string;
}

// Description: Lightweight wrapper delivering shared search defaults for dashboard listings.
// Data created: 2024-11-13
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
