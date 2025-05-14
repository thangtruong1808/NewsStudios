"use client";

import { SearchWrapper } from "@/app/components/dashboard/shared/search";

interface CategoriesSearchProps {
  onSearch: (term: string) => void;
}

export default function CategoriesSearch({ onSearch }: CategoriesSearchProps) {
  return (
    <div className="w-full">
      <SearchWrapper
        placeholder="Search categories by name or description..."
        onSearch={onSearch}
      />
    </div>
  );
}
