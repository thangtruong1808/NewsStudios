"use client";

import Search from "@/app/components/dashboard/shared/search/Search";

interface AuthorsSearchProps {
  onSearch: (term: string) => void;
}

// Description: Wrap shared search input for authors listing.
// Data created: 2024-11-13
// Author: thangtruong
export default function AuthorsSearch({ onSearch }: AuthorsSearchProps) {
  const handleSearch = (term: string) => {
    onSearch(term);
  };

  return (
    <Search
      placeholder="Search authors by name and description..."
      onSearch={handleSearch}
    />
  );
}
