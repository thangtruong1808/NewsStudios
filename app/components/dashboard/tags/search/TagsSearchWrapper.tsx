"use client";

import { SearchWrapper } from "@/app/components/dashboard/shared/search";

/* eslint-disable no-unused-vars */
interface TagsSearchWrapperProps {
  onSearch: ({ term }: { term: string }) => void;
}
/* eslint-enable no-unused-vars */

// Description: Bridge dashboard tag search term handling into shared search component.
// Data created: 2024-11-13
// Author: thangtruong

export default function TagsSearchWrapper({
  onSearch,
}: TagsSearchWrapperProps) {
  const handleSearch = (term: string) => {
    onSearch({ term });
  };

  return (
    <SearchWrapper
      placeholder="Search tags by name or description..."
      onSearch={handleSearch}
    />
  );
}
