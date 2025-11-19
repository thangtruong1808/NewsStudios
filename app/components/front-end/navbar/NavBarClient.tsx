"use client";

// Component Info
// Description: Client nav shell wiring logo, category menus, search drawer, and user session controls.
// Date created: 2025-01-27
// Author: thangtruong

import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import UserProfileDropdown from "./UserProfileDropdown";
import SearchDrawer from "./SearchDrawer";
import Logo from "../shared/Logo";
import Link from "next/link";
import type { MenuProps, NavMenuCategory } from "./types";

interface NavBarClientProps {
  categories: NavMenuCategory[];
}

export default function NavBarClient({ categories }: NavBarClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Get active category and subcategory from URL params
  const activeCategoryId = searchParams.get("categoryId");
  const activeSubcategoryId = searchParams.get("subcategoryId");

  // Check if category or subcategory is active
  const isActive: MenuProps["isActive"] = useMemo(
    () => (path: string) => {
      if (pathname === path) return true;
      if (pathname === "/explore") {
        const pathCategoryId = path.match(/\/category\/(\d+)/)?.[1];
        if (pathCategoryId && activeCategoryId === pathCategoryId) return true;
      }
      return false;
    },
    [pathname, activeCategoryId]
  );

  return (
    <>
      {/* Maintenance banner */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 text-center text-xs font-medium text-blue-700 shadow-sm sm:text-sm">
        We&apos;re currently upgrading the layout, you may notice minor issues. Please contact thangtruong if you need assistance.
      </div>
      {/* Navigation header with modern styling */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-white/90">
        <div className="mx-auto flex w-full max-w-[1536px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10 xl:px-16">
          {/* Logo section */}
          <Link href="/" aria-label="Go to homepage" className="inline-flex items-center gap-2 text-base font-semibold text-slate-800 transition-opacity hover:opacity-80">
            <Logo />
          </Link>

          {/* Category navigation */}
          <div className="hidden flex-1 px-6 md:flex">
            <DesktopMenu
              categories={categories}
              isActive={isActive}
              activeCategoryId={activeCategoryId ? Number(activeCategoryId) : null}
              activeSubcategoryId={activeSubcategoryId ? Number(activeSubcategoryId) : null}
            />
          </div>

          {/* Search and user actions */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Search button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              aria-label="Open search"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            {/* User profile / login action */}
            {session?.user ? (
              <UserProfileDropdown />
            ) : (
              <Link
                href="/login"
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <MobileMenu
              categories={categories}
              isActive={isActive}
              activeCategoryId={activeCategoryId ? Number(activeCategoryId) : null}
              activeSubcategoryId={activeSubcategoryId ? Number(activeSubcategoryId) : null}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Search drawer */}
      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} categories={categories} />
    </>
  );
}
