"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserIcon } from "@heroicons/react/24/outline";
import { MenuProps } from "./types";
import Logo from "../shared/Logo";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

// Component Info
// Description: Mobile navigation drawer with category accordion and account controls.
// Data created: Drawer visibility state and accordion selections for navigation.
// Author: thangtruong

export default function MobileMenu({ categories, isActive }: MenuProps) {
  const { data: session } = useSession();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setActiveCategoryId(null);
    setIsAccountOpen(false);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
    setIsAccountOpen(false);
  };

  const toggleCategoryAccordion = (categoryId: number) => {
    setActiveCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) closeDrawer();
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) setIsAccountOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (isDrawerOpen) {
      requestAnimationFrame(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = 0;
        }
      });
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    if (isDrawerOpen && categories.length > 0) {
      setActiveCategoryId(categories[0].id);
    }
  }, [isDrawerOpen, categories]);

  const handleSignOut = async () => {
    try {
      closeDrawer();
      await signOut({ redirect: false, callbackUrl: "/" });
      if (pathname === "/") router.push("/");
      else if (pathname.startsWith("/dashboard")) router.replace("/login");
      else router.push("/");
    } catch (_error) {
      // Silent: session state managed by NextAuth
    }
  };

  return (
    <div className="lg:hidden" ref={drawerRef}>
      <button
        onClick={toggleDrawer}
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-500 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="sr-only">Toggle navigation</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        <span>Menu</span>
      </button>

      <div className={`fixed inset-0 z-[1000] transition-all duration-300 ${isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 z-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={closeDrawer}
        />

        <div className="absolute inset-y-0 left-0 z-[1001] flex w-full max-w-sm">
          <div
            className={`flex h-full w-full transform flex-col bg-white shadow-2xl transition-transform duration-300 ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
              <Link href="/" onClick={closeDrawer} aria-label="Go to homepage">
                <Logo />
              </Link>
              <button
                onClick={toggleDrawer}
                className="rounded-md border border-slate-300 p-2 text-slate-500 transition hover:border-blue-500 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">Close navigation</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0" ref={scrollAreaRef}>
              <div className="px-5 py-4">
                <Link
                  href="/"
                  onClick={closeDrawer}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-blue-50 hover:text-blue-600 ${isActive("/") ? "bg-blue-50 text-blue-600" : "text-slate-700"
                    }`}
                >
                  Home
                </Link>
              </div>

              <div className="px-5 py-4">
                <p className="px-4 pb-3 text-xs uppercase tracking-wide text-slate-500 ">Browse Categories</p>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const subcats = category.subcategories;
                    const expanded = activeCategoryId === category.id;

                    return (
                      <div key={category.id} className="rounded-lg border border-slate-200">
                        <button
                          onClick={() => toggleCategoryAccordion(category.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 ${isActive(`/category/${category.id}`) ? "bg-blue-50 text-blue-600" : ""
                            }`}
                          aria-expanded={expanded}
                        >
                          <span className="truncate">{category.name}</span>
                          {subcats.length > 0 && (
                            <ChevronDownIcon
                              className={`h-5 w-5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                            />
                          )}
                        </button>

                        {expanded && subcats.length > 0 && (
                          <div className="space-y-1 border-t border-slate-100 bg-slate-50 px-3 py-2">
                            {subcats.map((subcategory) => (
                              <Link
                                key={subcategory.id}
                                href={`/explore?subcategoryId=${subcategory.id}`}
                                onClick={closeDrawer}
                                className="block rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-blue-100 hover:text-blue-600"
                              >
                                {subcategory.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 px-5 py-6">
              {session?.user ? (
                <div className="space-y-3" ref={accountRef}>
                  <button
                    onClick={() => setIsAccountOpen((prev) => !prev)}
                    className={`flex items-center justify-between gap-2 rounded-lg border-2 border-slate-500 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-500 ${isAccountOpen ? "text-blue-600" : ""
                      }`}
                    aria-expanded={isAccountOpen}
                  >
                    <span className="flex items-center gap-2">
                      {session.user.user_image ? (
                        <span className="relative h-8 w-8 overflow-hidden rounded-full">
                          <Image
                            src={session.user.user_image}
                            alt={`${session.user.firstname} ${session.user.lastname}`}
                            fill
                            className="object-cover"
                          />
                        </span>
                      ) : (
                        <UserIcon className="h-5 w-5" />
                      )}
                      <span>
                        {session.user.firstname} {session.user.lastname}
                      </span>
                    </span>
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform duration-200 ${isAccountOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isAccountOpen && (
                    <button
                      onClick={handleSignOut}
                      className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeDrawer}
                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-500 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-500"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
