"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import UserProfileDropdown from "./UserProfileDropdown";
import Logo from "../shared/Logo";
import Link from "next/link";
import type { MenuProps, NavMenuCategory } from "./types";

// Component Info
// Description: Client nav shell wiring logo, category menus, and user session controls.
// Date created: 2024
// Author: thangtruong

interface NavBarClientProps {
  categories: NavMenuCategory[];
}

export default function NavBarClient({ categories }: NavBarClientProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive: MenuProps["isActive"] = useMemo(
    () => (path: string) => pathname === path,
    [pathname]
  );

  return (
    <>
      {/* Maintenance banner */}
      <div className="w-full bg-blue-50 px-4 py-2 text-center text-xs font-medium text-blue-700 sm:text-sm">
        We&apos;re currently upgrading the layout; you may notice minor issues. Please contact thangtruong if you need assistance.
      </div>
      <header className="relative z-50 w-full border-b border-slate-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex w-full max-w-[1536px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10 xl:px-16">
          {/* Logo section */}
          <Link href="/" aria-label="Go to homepage" className="inline-flex items-center gap-2 text-base font-semibold text-slate-800">
            <Logo />
          </Link>

          {/* Category navigation */}
          <div className="hidden flex-1 px-6 md:flex">
            <DesktopMenu categories={categories} isActive={isActive} />
          </div>

          {/* User profile / login action */}
          <div className="hidden items-center gap-3 md:flex">
            {session?.user ? (
              <UserProfileDropdown />
            ) : (
              <Link
                href="/login"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-500"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <MobileMenu categories={categories} isActive={isActive} />
          </div>
        </div>
      </header>
    </>
  );
}
