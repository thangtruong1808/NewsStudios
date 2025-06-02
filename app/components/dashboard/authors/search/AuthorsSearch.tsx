"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SearchWrapper } from "@/app/components/dashboard/shared/search";

interface AuthorsSearchProps {
  onSearch: (term: string) => void;
}

export default function AuthorsSearch({ onSearch }: AuthorsSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Get current search value from URL
  const currentSearch = searchParams.get("query") || "";

  // Handle search with debounce to prevent too many requests
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <SearchWrapper
      placeholder="Search authors by name, or bio..."
      onSearch={onSearch}
      defaultValue={currentSearch}
    />
  );
}
