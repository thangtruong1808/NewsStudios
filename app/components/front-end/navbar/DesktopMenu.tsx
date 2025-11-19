"use client";

// Component Info
// Description: Desktop navigation list rendering categories and their submenus with icons.
// Date created: 2025-01-27
// Author: thangtruong

import { useMemo } from "react";
import Link from "next/link";
import { MenuProps } from "./types";
import { getCategoryIcon, getSubcategoryIcon } from "./categoryIcons";
import type { LucideIcon } from "lucide-react";

export default function DesktopMenu({ categories, activeCategoryId, activeSubcategoryId }: MenuProps) {
  // Track used icons per category to ensure subcategories from different categories get different icons
  const iconMapping = useMemo(() => {
    // Global set for category icons to prevent duplicates across categories
    const globalUsedIcons = new Set<LucideIcon>();
    const categoryIcons = new Map<number, LucideIcon>();
    const subcategoryIcons = new Map<number, LucideIcon>();

    categories.forEach((category) => {
      // Assign category icon (global tracking to prevent duplicates)
      const categoryIcon = getCategoryIcon(category.name, globalUsedIcons);
      categoryIcons.set(category.id, categoryIcon);
      globalUsedIcons.add(categoryIcon);

      // Track icons used within this specific category's subcategories
      const categorySubcategoryIcons = new Set<LucideIcon>();
      
      category.subcategories.forEach((subcategory) => {
        // Assign subcategory icon using per-category tracking
        // This ensures subcategories from different categories can have different icons
        const subcategoryIcon = getSubcategoryIcon(subcategory.name, categorySubcategoryIcons);
        subcategoryIcons.set(subcategory.id, subcategoryIcon);
        categorySubcategoryIcons.add(subcategoryIcon);
      });
    });

    return { categoryIcons, subcategoryIcons };
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4 text-sm xl:text-base">
      {/* Category links with dropdown submenus */}
      {categories.map((category) => {
        const CategoryIcon = iconMapping.categoryIcons.get(category.id);
        const isCategoryActive = activeCategoryId === category.id;
        const categoryLinkClass = `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isCategoryActive
          ? "text-blue-600 font-semibold bg-blue-50"
          : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
          }`;

        return (
          <div key={category.id} className="group relative">
            {/* Main category link */}
            <Link href={`/explore?categoryId=${category.id}`} className={categoryLinkClass}>
              {CategoryIcon && <CategoryIcon className="h-4 w-4 shrink-0" />}
              <span>{category.name}</span>
            </Link>

            {/* Subcategory dropdown menu */}
            {category.subcategories.length > 0 && (
              <div className="absolute left-1/2 hidden -translate-x-1/2 group-hover:block z-50 pt-2" style={{ top: "100%" }}>
                <div className="relative overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200/80 border border-slate-100">
                  {category.subcategories.map((subcategory) => {
                    const SubcategoryIcon = iconMapping.subcategoryIcons.get(subcategory.id);
                    const isSubcategoryActive = activeSubcategoryId === subcategory.id;
                    const subcategoryLinkClass = `flex items-center gap-2.5 w-52 px-4 py-2.5 text-xs transition-all duration-200 sm:text-sm sm:w-60 ${isSubcategoryActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                      }`;

                    return (
                      <Link key={subcategory.id} href={`/explore?subcategoryId=${subcategory.id}`} className={subcategoryLinkClass}>
                        {SubcategoryIcon && <SubcategoryIcon className="h-3.5 w-3.5 shrink-0" />}
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
