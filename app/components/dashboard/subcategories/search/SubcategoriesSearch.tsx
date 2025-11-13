"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SearchWrapper } from "@/app/components/dashboard/shared/search";

/* eslint-disable no-unused-vars */
interface SubcategoriesSearchProps {
  onSearch: (query: string) => void;
}
/* eslint-enable no-unused-vars */

export default function SubcategoriesSearch({
  onSearch,
}: SubcategoriesSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Get current search value from URL
  const currentSearch = searchParams.get("search") || "";

  // Handle search with debounce to prevent too many requests
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
    onSearch(term);
  }, 300);

  return (
    <SearchWrapper
      placeholder="Search subcategories by name, description, or category..."
      onSearch={handleSearch}
      defaultValue={currentSearch}
    />
  );
}
