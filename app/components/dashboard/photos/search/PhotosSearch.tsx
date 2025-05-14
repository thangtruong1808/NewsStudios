"use client";

import { SearchWrapper } from "@/app/components/dashboard/shared/search";

interface PhotosSearchProps {
  onSearch: (term: string) => void;
  defaultValue?: string;
}

/**
 * PhotosSearch Component
 *
 * A search component for photos that:
 * - Uses the shared SearchWrapper component
 * - Provides a search input for filtering photos
 * - Maintains consistent styling with other search components
 */
export default function PhotosSearch({
  onSearch,
  defaultValue = "",
}: PhotosSearchProps) {
  return (
    <div className="mt-4">
      <div className="w-full">
        <SearchWrapper
          placeholder="Search photos by title or description..."
          onSearch={onSearch}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
}
