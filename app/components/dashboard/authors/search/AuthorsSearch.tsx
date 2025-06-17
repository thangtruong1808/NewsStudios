"use client";

import Search from "@/app/components/dashboard/shared/search/Search";

interface AuthorsSearchProps {
  onSearch: (term: string) => void;
}

export default function AuthorsSearch({ onSearch }: AuthorsSearchProps) {
  return (
    <Search
      placeholder="Search authors by name and description..."
      onSearch={onSearch}
    />
  );
}
