"use client";

import Link from "next/link";
import Image from "next/image";
import { MenuProps } from "./types";
import { subcategories } from "@/app/lib/data/categories";
import { UserIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Logo from "../shared/Logo";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

// Component Info
// Description: Desktop navigation layout with logo, category links, and user menu.
// Data created: Dropdown visibility state for user account actions.
// Author: thangtruong

export default function DesktopMenu({
  categories,
  isLoading,
  isActive,
}: MenuProps) {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getSubcategoriesForCategory = (categoryId: number) =>
    subcategories.filter((sub) => sub.category_id === categoryId);

  const handleSignOut = async () => {
    try {
      setIsDropdownOpen(false);
      await signOut({ redirect: false, callbackUrl: "/" });

      if (pathname === "/") {
        router.push("/");
      } else if (pathname.startsWith("/dashboard")) {
        router.replace("/login");
      } else {
        router.push("/");
      }
    } catch (_error) {
      // Silent fail: NextAuth manages session state
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full items-center justify-between gap-6 rounded-xl border border-slate-200 bg-white/80 px-6 py-3 shadow-sm">
      <div className="flex items-center gap-8">
        <Link href="/" className="inline-flex items-center" aria-label="Go to homepage">
          <Logo />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center lg:flex">
          <div className="mx-auto flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm xl:text-base">
            {!isLoading &&
              categories.map((category) => (
                <div key={category.id} className="group relative">
                  <Link
                    href={`/explore?categoryId=${category.id}`}
                    className={`px-1 font-medium transition-colors duration-150 hover:text-blue-500 ${isActive(`/category/${category.id}`) ? "text-blue-600" : "text-gray-600"
                      }`}
                  >
                    {category.name}
                  </Link>

                  <div
                    className="absolute left-1/2 hidden w-48 -translate-x-1/2 rounded-md bg-white shadow-lg ring-1 ring-black/10 group-hover:block"
                    style={{ top: "calc(100% + 12px)" }}
                  >
                    <div className="py-2">
                      {getSubcategoriesForCategory(category.id).map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/explore?subcategoryId=${subcategory.id}`}
                          className="block px-3 py-2 text-xs text-gray-700 transition-colors duration-150 hover:bg-gray-100 hover:text-blue-500 sm:text-sm"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        {session?.user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`flex flex-col items-center rounded-md border-2 border-gray-500 px-3 py-1.5 text-sm font-medium transition-all duration-150 hover:border-blue-500 hover:text-blue-500 ${isActive("/profile") ? "text-blue-600" : "text-gray-600"
                }`}
              aria-haspopup="menu"
              aria-expanded={isDropdownOpen}
            >
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
              <span className="mt-1 text-center text-sm">
                {session.user.firstname} {session.user.lastname}
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-40 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/10" role="menu">
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100 hover:text-blue-500"
                  role="menuitem"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-md border-2 border-gray-400 px-3 py-1.5 text-sm font-medium transition-all duration-150 hover:border-blue-500 hover:text-blue-500 ${isActive("/login") ? "text-blue-600" : "text-gray-600"
              }`}
          >
            <UserIcon className="h-5 w-5" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}
