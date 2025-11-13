"use client";

import Search from "@/app/components/dashboard/shared/search/Search";

/* eslint-disable no-unused-vars */
interface CategoriesSearchProps {
  onSearch({ term }: { term: string }): void;
  defaultValue?: string;
}
/* eslint-enable no-unused-vars */

// Description: Wrap shared search input for categories listing with default value support.
// Data created: 2024-11-13
// Author: thangtruong
export default function CategoriesSearch({
  onSearch,
  defaultValue = "",
}: CategoriesSearchProps) {
  const handleSearch = (term: string) => {
    onSearch({ term });
  };

  return (
    <Search
      placeholder="Search categories by name and description..."
      onSearch={handleSearch}
      defaultValue={defaultValue}
    />
  );
}
