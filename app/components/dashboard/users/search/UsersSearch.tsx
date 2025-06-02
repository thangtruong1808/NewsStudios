"use client";

import { SearchWrapper } from "@/app/components/dashboard/shared/search";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * UsersSearch Component
 * Provides search functionality for the users list with features:
 * - Real-time search input with debouncing
 * - URL-based search state management
 * - Resets to first page on new search
 * - Preserves other URL parameters during search
 */
export default function UsersSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Handles search term changes by:
   * - Updating URL search parameters
   * - Resetting pagination to first page
   * - Preserving other existing URL parameters
   */
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mt-8">
      <SearchWrapper
        placeholder="Search users by name, email, or role . . ."
        onSearch={handleSearch}
      />
    </div>
  );
}
