"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchWrapper } from "@/app/components/dashboard/shared/search";

export default function TagsSearchWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <SearchWrapper
      placeholder="Search tags by name or description..."
      onSearch={handleSearch}
    />
  );
}
