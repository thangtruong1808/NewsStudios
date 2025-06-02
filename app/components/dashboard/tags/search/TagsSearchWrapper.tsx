"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchWrapper } from "@/app/components/dashboard/shared/search";

interface TagsSearchWrapperProps {
  onSearch: (term: string) => void;
}

export default function TagsSearchWrapper({
  onSearch,
}: TagsSearchWrapperProps) {
  return (
    <SearchWrapper
      placeholder="Search tags by name or description..."
      onSearch={onSearch}
    />
  );
}
