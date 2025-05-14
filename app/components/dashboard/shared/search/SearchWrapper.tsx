"use client";

import Search from "./Search";

interface SearchWrapperProps {
  placeholder?: string;
  onSearch?: (term: string) => void;
  defaultValue?: string;
}

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
