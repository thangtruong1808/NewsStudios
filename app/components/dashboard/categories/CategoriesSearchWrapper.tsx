"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import SearchWrapper from "../shared/search/SearchWrapper";

export default function CategoriesSearchWrapper() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <SearchWrapper
      placeholder="Search categories..."
      onSearch={handleSearch}
      defaultValue={searchParams.get("query")?.toString()}
    />
  );
}
