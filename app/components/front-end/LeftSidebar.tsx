"use client";

import Link from "next/link";
import { StarIcon, NewspaperIcon, FireIcon } from "@heroicons/react/24/outline";

export default function LeftSidebar() {
  return (
    <div className="hidden lg:block w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 p-4 text-white rounded-lg">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Quick Links</h2>
        <nav className="space-y-2">
          <Link
            href="/featured"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            <StarIcon className="h-5 w-5" />
            Featured Articles
          </Link>
          <Link
            href="/headlines"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            <NewspaperIcon className="h-5 w-5" />
            Headlines Articles
          </Link>
          <Link
            href="/trending"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            <FireIcon className="h-5 w-5" />
            Trending Articles
          </Link>
        </nav>
      </div>
    </div>
  );
}
