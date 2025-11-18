"use client";

import Link from "next/link";
import { MenuProps } from "./types";

// Component Info
// Description: Desktop navigation list rendering categories and their submenus.
// Date created: 2024
// Author: thangtruong

export default function DesktopMenu({ categories, isActive }: MenuProps) {
  // Early return if no categories
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4 text-sm xl:text-base">
      {/* Category links with dropdown submenus */}
      {categories.map((category) => (
        <div key={category.id} className="group relative">
          {/* Main category link */}
          <Link
            href={`/explore?categoryId=${category.id}`}
            className={`px-1 font-medium transition-colors duration-150 hover:text-blue-500 ${isActive(`/category/${category.id}`) ? "text-blue-600" : "text-gray-600"
              }`}
          >
            {category.name}
          </Link>

          {/* Subcategory dropdown menu */}
          {category.subcategories.length > 0 && (
            <div
              className="absolute left-1/2 hidden -translate-x-1/2 group-hover:block z-50"
              style={{ top: "100%" }}
            >
              <div className="relative top-3 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/10">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/explore?subcategoryId=${subcategory.id}`}
                    className="block w-52 px-4 py-2 text-xs text-gray-700 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-500 sm:text-sm sm:w-60"
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
