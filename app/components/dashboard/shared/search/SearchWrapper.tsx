"use client";

import Search from "./Search";

interface SearchWrapperProps {
  placeholder?: string;
  onSearch?: (term: string) => void;
}

export default function SearchWrapper({
  placeholder = "Search...",
  onSearch,
}: SearchWrapperProps) {
  return <Search placeholder={placeholder} onSearch={onSearch} />;
}
