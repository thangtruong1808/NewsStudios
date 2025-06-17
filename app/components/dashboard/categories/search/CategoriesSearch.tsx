"use client";

import Search from "@/app/components/dashboard/shared/search/Search";

interface CategoriesSearchProps {
  onSearch: (_term: string) => void;
  defaultValue?: string;
}

export default function CategoriesSearch({ onSearch, defaultValue = "" }: CategoriesSearchProps) {
  return (
    <Search
      placeholder="Search categories by name and description..."
      onSearch={onSearch}
      defaultValue={defaultValue}
    />
  );
}
