"use client";

// Component Info
// Description: Desktop navigation list rendering categories and their submenus.
// Date updated: 2025-November-21
// Author: thangtruong

import Link from "next/link";
import { MenuProps } from "./types";

export default function DesktopMenu({ categories, activeCategoryId, activeSubcategoryId }: MenuProps) {
  if (categories.length === 0) return null;

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4 text-sm xl:text-base">
      {/* Category links with dropdown submenus */}
      {categories.map((category) => {
        const isCategoryActive = activeCategoryId === category.id;
        const categoryLinkClass = `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isCategoryActive
          ? "text-blue-600 font-semibold bg-blue-50"
          : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
          }`;

        return (
          <div key={category.id} className="group relative">
            {/* Main category link */}
            <Link href={`/explore?categoryId=${category.id}`} className={categoryLinkClass}>
              <span>{category.name}</span>
            </Link>

            {/* Subcategory dropdown menu */}
            {category.subcategories.length > 0 && (
              <div className="absolute left-1/2 hidden -translate-x-1/2 group-hover:block z-50 pt-2" style={{ top: "100%" }}>
                <div className="relative overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200/80 border border-slate-100">
                  {category.subcategories.map((subcategory) => {
                    const isSubcategoryActive = activeSubcategoryId === subcategory.id;
                    const subcategoryLinkClass = `flex items-center gap-2.5 w-52 px-4 py-2.5 text-xs transition-all duration-200 sm:text-sm sm:w-60 ${isSubcategoryActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                      }`;

                    return (
                      <Link key={subcategory.id} href={`/explore?subcategoryId=${subcategory.id}`} className={subcategoryLinkClass}>
                        <span className="truncate">{subcategory.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
