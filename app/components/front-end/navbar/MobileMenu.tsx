"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon, ChevronDownIcon, KeyIcon, Squares2X2Icon, ArrowRightOnRectangleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MenuProps } from "./types";
import Logo from "../shared/Logo";
import { getCategoryIcon, getSubcategoryIcon } from "./categoryIcons";
import type { LucideIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

// Component Info
// Description: Mobile navigation drawer with category accordion and account controls with avatar initials fallback.
// Date created: 2025-01-27
// Author: thangtruong

interface MobileMenuProps extends MenuProps {
  onOpenSearch?: () => void;
}

export default function MobileMenu({ categories = [], activeCategoryId: urlCategoryId, activeSubcategoryId: urlSubcategoryId, onOpenSearch }: MobileMenuProps) {
  // Note: isActive prop is available but not currently used
  const { data: session } = useSession();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Track used icons to prevent duplicates
  const iconMapping = useMemo(() => {
    const usedIcons = new Set<LucideIcon>();
    const categoryIcons = new Map<number, LucideIcon>();
    const subcategoryIcons = new Map<number, LucideIcon>();

    categories.forEach((category) => {
      const categoryIcon = getCategoryIcon(category.name, usedIcons);
      categoryIcons.set(category.id, categoryIcon);
      usedIcons.add(categoryIcon);

      category.subcategories.forEach((subcategory) => {
        const subcategoryIcon = getSubcategoryIcon(subcategory.name, usedIcons);
        subcategoryIcons.set(subcategory.id, subcategoryIcon);
        usedIcons.add(subcategoryIcon);
      });
    });

    return { categoryIcons, subcategoryIcons };
  }, [categories]);

  // Close drawer handler
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setExpandedCategoryId(null);
    setIsAccountOpen(false);
  };

  // Toggle drawer handler
  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
    setIsAccountOpen(false);
  };
  // Toggle category accordion handler
  const toggleCategoryAccordion = (categoryId: number) => {
    setExpandedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      closeDrawer();
      await signOut({ redirect: false, callbackUrl: "/" });
      if (pathname === "/") router.push("/");
      else if (pathname.startsWith("/dashboard")) router.replace("/login");
      else router.push("/");
    } catch {
      // Silent: session state managed by NextAuth
    }
  };

  // Get user initials helper
  const getUserInitials = () => {
    if (session?.user?.firstname && session?.user?.lastname) {
      return `${session.user.firstname.charAt(0).toUpperCase()}${session.user.lastname.charAt(0).toUpperCase()}`;
    }
    if (session?.user?.firstname) return session.user.firstname.charAt(0).toUpperCase();
    if (session?.user?.lastname) return session.user.lastname.charAt(0).toUpperCase();
    return "U";
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) closeDrawer();
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) setIsAccountOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    if (isDrawerOpen && scrollAreaRef.current) {
      requestAnimationFrame(() => {
        if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0;
      });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <>
      <div className="lg:hidden flex items-center gap-2" ref={drawerRef}>
        {/* Search button */}
        <button
          onClick={() => {
            closeDrawer();
            onOpenSearch?.();
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open search"
        >
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        {/* Menu trigger button */}
        <button
          onClick={toggleDrawer}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open navigation menu"
        >
          <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          <span>Menu</span>
        </button>

      {/* Drawer overlay and panel */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[1000] h-screen w-screen transition-all duration-300 ease-in-out pointer-events-auto">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 z-0 h-full w-full bg-black/50 backdrop-blur-sm transition-opacity duration-300 opacity-100"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="absolute inset-y-0 left-0 z-[1001] h-full flex w-full max-w-sm">
            <div className="flex h-full w-full transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out translate-x-0">
              {/* Drawer header */}
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-4">
                <Link href="/" onClick={closeDrawer} aria-label="Go to homepage" className="flex-shrink-0">
                  <Logo />
                </Link>
                <button
                  onClick={closeDrawer}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close navigation menu"
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain" ref={scrollAreaRef}>
                <nav className="px-4 py-4" aria-label="Main navigation">
                  {/* Categories section */}
                  {categories && categories.length > 0 ? (
                    <div className="mb-4">
                      <div className="space-y-2">
                        {categories.map((category) => {
                          const CategoryIcon = iconMapping.categoryIcons.get(category.id);
                          if (!CategoryIcon) return null;
                          const hasSubcategories = category.subcategories && Array.isArray(category.subcategories) && category.subcategories.length > 0;
                          const isCategoryActive = urlCategoryId === category.id;
                          const isExpanded = Boolean(expandedCategoryId === category.id || urlCategoryId === category.id || (urlSubcategoryId && category.subcategories.some((sub) => sub.id === urlSubcategoryId)));
                          const categoryActiveClass = isCategoryActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-700 hover:bg-slate-50";
                          return (
                            <div key={category.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md">
                              {hasSubcategories ? (
                                <button onClick={() => toggleCategoryAccordion(category.id)} className={`flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium transition-colors ${categoryActiveClass}`} aria-expanded={isExpanded}>
                                  <div className="flex items-center gap-2 min-w-0">
                                    <CategoryIcon className="h-5 w-5 shrink-0" />
                                    <span className="truncate">{category.name}</span>
                                  </div>
                                  <ChevronDownIcon className={`ml-2 h-5 w-5 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                                </button>
                              ) : (
                                <Link href={`/explore?categoryId=${category.id}`} onClick={closeDrawer} className={`flex w-full items-center gap-2 px-4 py-3 text-base font-medium transition-colors ${categoryActiveClass}`}>
                                  <CategoryIcon className="h-5 w-5 shrink-0" />
                                  <span className="truncate">{category.name}</span>
                                </Link>
                              )}
                              {isExpanded && hasSubcategories && category.subcategories && (
                                <div className="border-t border-slate-100 bg-slate-50">
                                  <div className="px-2 py-2">
                                    {category.subcategories.map((subcategory) => {
                                      const SubcategoryIcon = iconMapping.subcategoryIcons.get(subcategory.id);
                                      if (!SubcategoryIcon) return null;
                                      const isSubcategoryActive = urlSubcategoryId === subcategory.id;
                                      const subcategoryActiveClass = isSubcategoryActive
                                        ? "bg-blue-100 text-blue-700 font-semibold"
                                        : "text-slate-600 hover:bg-blue-100 hover:text-blue-700";
                                      return (
                                        <Link key={subcategory.id} href={`/explore?subcategoryId=${subcategory.id}`} onClick={closeDrawer} className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-colors ${subcategoryActiveClass}`}>
                                          <SubcategoryIcon className="h-4 w-4 shrink-0" />
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
                    </div>
                  ) : null}
                </nav>
              </div>

              {/* Account section footer */}
              <div className="shrink-0 border-t border-slate-200 bg-white px-4 pt-4 pb-12" style={{ paddingBottom: "max(4rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))" }}>
                {session?.user ? (
                  <div className="space-y-3" ref={accountRef}>
                    <button onClick={() => setIsAccountOpen((prev) => !prev)} className={`flex w-full items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all ${isAccountOpen ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-slate-50"}`} aria-expanded={isAccountOpen}>
                      <span className="flex min-w-0 flex-1 items-center gap-3">
                        {/* Avatar with initials fallback */}
                        {session.user.user_image && typeof session.user.user_image === "string" && session.user.user_image.trim() !== "" ? (
                          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-200">
                            <Image src={session.user.user_image} alt={`${session.user.firstname} ${session.user.lastname}`} fill className="object-cover" />
                          </span>
                        ) : (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-300 ring-2 ring-slate-200">
                            <span className="text-sm font-medium text-white">{getUserInitials()}</span>
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{session.user.firstname} {session.user.lastname}</span>
                          <span className="block truncate text-xs text-slate-500 ">{session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}</span>
                        </span>
                      </span>
                      <ChevronDownIcon className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${isAccountOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isAccountOpen && (
                      <div className="space-y-2">
                        <Link href="/dashboard" onClick={closeDrawer} className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600">
                          <Squares2X2Icon className="h-5 w-5 text-slate-400" />
                          <span>Dashboard</span>
                        </Link>
                        <Link href="/login/reset-password" onClick={closeDrawer} className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600">
                          <KeyIcon className="h-5 w-5 text-slate-400" />
                          <span>Update Password</span>
                        </Link>
                        <button onClick={handleSignOut} className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 w-full">
                          <ArrowRightOnRectangleIcon className="h-5 w-5 transition-colors duration-200" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeDrawer}
                    className="flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-500"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
