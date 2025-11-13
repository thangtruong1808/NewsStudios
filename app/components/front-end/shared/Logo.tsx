"use client";

import { NewspaperIcon } from "@heroicons/react/24/outline";

// Component Info
// Description: Brand logo mark shared across layouts and navigation.
// Data created: Visual logo glyph and wordmark for NewsStudios.
// Author: thangtruong

export default function Logo() {
  return (
    <div className="flex flex-col items-center text-black transition hover:text-blue-500 xl:flex-row xl:items-center">
      <NewspaperIcon className="h-8 w-8" />
      <span className="mt-1 text-xl font-bold xl:ml-2 xl:mt-0">NewsStudios</span>
    </div>
  );
}
