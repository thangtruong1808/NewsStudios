"use client";

import Search from "@/app/components/dashboard/shared/search/Search";

/* eslint-disable no-unused-vars */
interface AuthorsSearchProps {
  onSearch({ term }: { term: string }): void;
}
/* eslint-enable no-unused-vars */

// Description: Wrap shared search input for authors listing.
// Data created: 2024-11-13
// Author: thangtruong
export default function AuthorsSearch({ onSearch }: AuthorsSearchProps) {
  const handleSearch = (term: string) => {
    onSearch({ term });
  };

  return (
    <Search
      placeholder="Search authors by name and description..."
      onSearch={handleSearch}
    />
  );
}
