"use client";

import { NewspaperIcon } from "@heroicons/react/24/outline";

export default function Logo() {
  return (
    <div className="flex items-center">
      <NewspaperIcon className="h-8 w-8 text-black" />
      <span className="ml-2 text-xl font-bold text-black">NewsStudios</span>
    </div>
  );
}
