"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchProps {
  placeholder: string;
  onSearch?: (term: string) => void;
  defaultValue?: string;
}

// Description: Debounced dashboard search input syncing with URL parameters when no callback provided.
// Data created: 2024-11-13
// Author: thangtruong
const Search = ({ placeholder, onSearch, defaultValue = "" }: SearchProps) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(defaultValue);

  // Keep local state in sync with external updates to the default value.
  useEffect(() => {
    setSearchValue(defaultValue);
    if (inputRef.current) {
      inputRef.current.value = defaultValue;
    }
  }, [defaultValue]);

  const applySearchTerm = useCallback(
    (term: string) => {
      if (onSearch) {
        onSearch(term);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      params.set("page", "1");

      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }

      replace(`${pathname}?${params.toString()}`);
    },
    [onSearch, pathname, replace]
  );

  // Debounce search updates for smoother UX.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      applySearchTerm(searchValue.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [applySearchTerm, searchValue]);

  const handleSearch = (term: string) => {
    setSearchValue(term);
  };

  const handleClear = () => {
    setSearchValue("");
    applySearchTerm("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="table-search" className="sr-only">
        Search
      </label>
      <input
        ref={inputRef}
        id="table-search"
        className="peer block w-full rounded-md border border-gray-200 py-[10px] pl-10 pr-10 ring-1 ring-inset ring-gray-400 text-sm outline-1 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(event) => handleSearch(event.target.value)}
        defaultValue={defaultValue}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      {searchValue && (
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
