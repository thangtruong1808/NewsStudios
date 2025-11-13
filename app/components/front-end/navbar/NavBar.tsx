"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter, Playfair_Display } from "next/font/google";
import Logo from "../shared/Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { categories } from "@/app/lib/data/categories";
import type { MenuProps } from "./types";

// Component Info
// Description: Responsive navigation shell coordinating desktop and mobile menus.
// Data created: Active-path matcher passed to child menus alongside category data.
// Author: thangtruong

const navBodyFont = Inter({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });
const navAccentFont = Playfair_Display({ subsets: ["latin"], weight: ["600"], display: "swap", variable: "--font-nav-accent" });

export default function NavBar() {
  const pathname = usePathname();

  const isActive: MenuProps["isActive"] = useMemo(
    () => (path: string) => pathname === path,
    [pathname]
  );

  return (
    <header
      className={`${navBodyFont.className} ${navAccentFont.variable} w-full border-b border-slate-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70`}
    >
      <div className="mx-auto flex w-full max-w-[1536px] items-center justify-between gap-4 px-6 py-3 sm:px-10 lg:px-12 xl:px-16">
        <Link
          href="/"
          aria-label="Go to homepage"
          className="inline-flex items-center gap-2 text-base font-semibold text-slate-800"
        >
          <Logo />
        </Link>

        <div className="hidden flex-1 pl-8 lg:flex" style={{ fontFamily: "var(--font-nav-accent)" }}>
          <DesktopMenu categories={categories} isLoading={false} isActive={isActive} />
        </div>

        <div className="flex lg:hidden">
          <MobileMenu categories={categories} isLoading={false} isActive={isActive} />
        </div>
      </div>
    </header>
  );
}
