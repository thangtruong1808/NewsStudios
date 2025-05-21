"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useRef, useEffect, useCallback } from "react";

interface SearchProps {
  placeholder: string;
  onSearch?: (term: string) => void;
  defaultValue?: string;
}

// Custom hook for debouncing
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

const Search = ({ placeholder, onSearch, defaultValue = "" }: SearchProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  // Get the current search query from the URL
  const currentQuery = searchParams.get("query")?.toString() || defaultValue;

  // Update the input value when the URL parameters change
  useEffect(() => {
    if (!isFirstRender.current && inputRef.current) {
      inputRef.current.value = currentQuery;
    }
    isFirstRender.current = false;
  }, [currentQuery]);

  const updateSearchParams = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset to first page on new search
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  // Create debounced search function with 300ms delay
  const debouncedSearch = useDebounce((term: string) => {
    if (onSearch) {
      onSearch(term);
    } else {
      updateSearchParams(term);
    }
  }, 300);

  const handleSearch = (term: string) => {
    debouncedSearch(term);
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (onSearch) {
      onSearch(""); // Call onSearch with empty string to trigger data refresh
    } else {
      updateSearchParams(""); // Clear immediately without debounce
    }
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        ref={inputRef}
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 pr-10 text-sm outline-1 placeholder:text-gray-500 "
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={currentQuery}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      {currentQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Search;
