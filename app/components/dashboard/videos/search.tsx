"use client";

import { SearchWrapper } from "@/app/components/dashboard/shared/search";

interface VideosSearchProps {
  onSearch: (term: string) => void;
  defaultValue?: string;
}

/**
 * VideosSearch Component
 *
 * A search component for videos that:
 * - Uses the shared SearchWrapper component
 * - Provides a search input for filtering videos
 * - Maintains consistent styling with other search components
 */
export default function VideosSearch({
  onSearch,
  defaultValue = "",
}: VideosSearchProps) {
  return (
    <div className="mt-4">
      <div className="w-full">
        <SearchWrapper
          placeholder="Search videos by title or description..."
          onSearch={onSearch}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
}
