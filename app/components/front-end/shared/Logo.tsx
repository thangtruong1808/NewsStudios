"use client";

import { NewspaperIcon } from "@heroicons/react/24/outline";

export default function Logo() {
  return (
    <div className="flex flex-col xl:flex-row items-center text-black hover:text-green-500">
      <NewspaperIcon className="h-8 w-8" />
      <span className="mt-1 xl:mt-0 xl:ml-2 text-xl font-bold">NewsStudios</span>
    </div>

  );
}
