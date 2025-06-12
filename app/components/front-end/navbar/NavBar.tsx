"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import PortfolioNotice from "../PortfolioNotice";
import type { MenuProps } from "./types";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import { categories } from "@/app/lib/data/categories";

export default function NavBar() {
  const [isLoading] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <PortfolioNotice />
      <div className="w-screen bg-gray-100 relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto">
          <nav className="w-full py-6">
            {/* Navigation Section */}
            <div className="w-full">
              <div className="w-full">
                {/* flex justify-between items-center */}
                <div className=" py-2">
                  {/* Desktop Menu */}
                  <div className="hidden lg:block w-full">
                    <DesktopMenu
                      categories={categories}
                      isLoading={isLoading}
                      isActive={isActive}
                    />
                  </div>

                  {/* Mobile Menu */}
                  <div className="lg:hidden flex items-center justify-end px-6">
                    <MobileMenu
                      categories={categories}
                      isLoading={isLoading}
                      isActive={isActive}
                    />
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
